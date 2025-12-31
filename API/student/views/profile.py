from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsStudent, IsValidatedStudent
from student.serializers import StudentProfileDisplaySerializer, StudentProfileEditSerializer
from student.serializers import AddSkillSerializer, SkillWrapperSerializer, StudentProofSerializer, StudentKYCSerializer
from student.models import SkillWrapper, StudentKYC, SkillTest
from student.serializers import MakeSkillTestSerializer, SkillTestSummarySerializer
from student.utils import make_skill_test, make_file, correct_skill_test, parse_test_file
from django.core.files.base import ContentFile
from student.config import TEST_DURATION, TEST_DURATION_OFFSET
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError
import uuid

class Profile(APIView):
    """
    Docstring for Profile
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request: Request):
        user = request.user
        profile = StudentProfileDisplaySerializer(user).data
        return Response({
            'profile': profile
        })

    def patch(self, request: Request):
        serializer = StudentProfileEditSerializer(data=request.data, instance=request.user)
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        profile = StudentProfileDisplaySerializer(request.user).data
        return Response({
            'msg': 'successfully updated',
            'profile': profile
        })

class EditSkills(APIView):
    """
    Docstring for ManageSkills
    """

    permission_classes = [IsAuthenticated, IsStudent]

    def delete(self, request: Request):
        pass

class AddSkills(APIView):
    """
    Docstring for AddSkill
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def put(self, request: Request):
        
        user = request.user
        serializer = AddSkillSerializer(data=request.data, context={
            'request': request
        })
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()

        return Response({
            'msg': 'skill successfully added',
            'skills': SkillWrapperSerializer(SkillWrapper.objects.filter(student=user.student), many=True).data
        })

class ManageKYC(APIView):

    """
    Docstring for ManageKYC
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request: Request):
        user = request.user
        # Check if student has pending proof
        if (StudentKYC.objects.filter(student=user.student, status='in_progress').exists()):
            return Response({
                'detail': ['cannot add student proof']
            }, status=400)
        
        # Check if student has a recent proof
        proofs = StudentKYC.objects.filter(student=user.student, status='validated').order_by('-submitted_at')
        if (proofs.exists()):
            last_proof = proofs.first()
            if (last_proof.submitted_elapsed_time < 320):
                return Response({
                    'detail': ['cannot add student proof']
                }, status=400)

        # Validate and create proof
        serializer = StudentProofSerializer(data=request.data, context={
            'request': request
        })

        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()

        return Response({
            'msg': 'student proof successfully added',
            'kycs': StudentKYCSerializer(user.student.kycs, many=True).data
        })

class MakeTest(APIView):
    """
    Docstring for MakeTest
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request: Request):
        user = request.user
        # Validate form
        serializer = MakeSkillTestSerializer(data=request.data)
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        skill_name = serializer.validated_data.get('skill_name')
        
        # Get skill wrapper
        try:
            skill_wrapper = SkillWrapper.objects.get(student=user.student, skill__name=skill_name)
        except SkillWrapper.DoesNotExist:
            return Response({
                'skill_name': 'invalid skill name'
            }, status=400)
        
        # Get available test
        available_tests = skill_wrapper.tests.filter(ended=False)
        if (available_tests.exists()):
            test = available_tests.first()
            return Response({
                'uuid': str(test.uuid)
            })
        
        # Make test otherwise
        new_test = make_skill_test(skill_wrapper.skill.name)
        file = ContentFile(new_test.encode('utf-8'))
        file.name = f'{str(uuid.uuid4())}.json'
        file = make_file(file)
        raw_test = SkillTest.objects.create(
            file=file,
            skill=skill_wrapper,
            expires_at=timezone.now() + timedelta(minutes=20)
        )
        return Response({
            'uuid': raw_test.uuid
        })


class TestManagement(APIView):
    """
    Docstring for TestManagement
    """

    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request: Request, uuid):
        user = request.user

        # Get test
        try:
            test = SkillTest.objects.get(
                uuid=uuid,
                skill__student=user.student
            )
        except (SkillTest.DoesNotExist, ValidationError):
            return Response({
                'detail': 'skill not found'
            }, status=404)
        
        # Send test summary if test was made
        if (test.ended == True):
            return Response({
                'test': SkillTestSummarySerializer(test, context={
                    'request': request
                }).data
            })
        
        # Launch test
        # if (not test.expires_at):
        #     test.expires_at = timezone.now() + TEST_DURATION
        #     test.save()

        return Response({
            'msg': 'test successfully launched',
            'test_file': test.file.url,
            'ended': False,
            'expires_at': test.expires_at
        })
    
    def put(self, request: Request, uuid):
        user = request.user

        # Get test
        try:
            test = SkillTest.objects.get(
                uuid=uuid,
                ended=False,
                skill__student=user.student
            )
        except SkillTest.DoesNotExist:
            return Response({
                'detail': 'skill not found'
            }, status=404)
        # Check if time is over
        if (timezone.now() + timedelta(seconds=TEST_DURATION_OFFSET) > test.expires_at):
            test.rate = 0.0
            test.ended = True
            test.save()
            return Response({
                'msg': 'test saved'
            })
        # Validate data
        responses = request.data.get('responses', None)
        if (responses == None or not isinstance(responses, dict)):
            return Response({
                'detail': 'invalid responses field'
            }, status=400)
        
        # Correct test
        final_rate = correct_skill_test(responses, parse_test_file(test)['questions'])
        test.rate = final_rate
        test.ended = True
        test.save()
        
        # Update test rate
        skill_wrapper = test.skill
        total_rate = 0.0
        ended_tests = skill_wrapper.tests.filter(ended=True)
        for _test in ended_tests:
            total_rate += _test.rate
        skill_wrapper.test_rate = (total_rate) / len(ended_tests) if len(ended_tests) > 0 else 0
        skill_wrapper.save()
        return Response({
            'msg': 'test saved'
        })
