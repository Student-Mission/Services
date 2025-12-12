from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsStudent, IsValidatedStudent
from student.serializers import StudentProfileDisplaySerializer, StudentProfileEditSerializer
from student.serializers import AddSkillSerializer, SkillWrapperSerializer, StudentProofSerializer, StudentKYCSerializer
from student.models import SkillWrapper, StudentKYC

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

    def put(self, request: Request):
        serializer = StudentProfileEditSerializer(data=request.data, instance=request.user)
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({
            'msg': 'successfully updated'
        })

class EditSkills(APIView):
    """
    Docstring for ManageSkills
    """

    permission_classes = [IsAuthenticated, IsStudent]

    def delete(self, request: Request):
        pass

class AddSkill(APIView):
    """
    Docstring for AddSkill
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request: Request):
        
        user = request.user
        serializer = AddSkillSerializer(request.data, context={
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
                'detail': 'cannot add student proof'
            }, status=403)
        
        # Check if student has a recent proof
        proofs = StudentKYC.objects.filter(student=user.student, status='validated').order_by('-submitted_at')
        if (proofs.exists()):
            last_proof = proofs.first()
            if (last_proof.submitted_elapsed_time < 320):
                return Response({
                    'detail': 'cannot add student proof'
                }, status=403)

        # Validate and create proof
        serializer = StudentProofSerializer(request.data)

        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()

        return Response({
            'msg': 'student proof successfully added',
            'kycs': StudentKYCSerializer(user.student.kycs, many=True).data
        })
