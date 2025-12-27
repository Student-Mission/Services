from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsCompany, IsValidatedCompany
from .models import Mission, Role, Application
from .serializers import NewMissionSerializer
from .utils import get_applications_rate, get_missions_per_month
from .serializers import CompanyUserProfileSerializer, AccountSerializer, CompanyKYCSerializer, MissionCardSerializer
from rest_framework.parsers import FormParser, MultiPartParser
from .serializers import MissionDetailsSerializer, ApplicationSerializer
from django.core.exceptions import ValidationError
from .serializers import MissionEditSerializer
from mission_admin.models import Skill
from student.models import SkillWrapper
from django.db import transaction
from users.models import Notification
from users.serializers import AlertSerializer
from users.utils import trigger_notification

class Dashboard(APIView):
    permission_classes = [IsAuthenticated, IsCompany]

    def get(self, request: Request):
        user = request.user
        # Make header
        header = {
            'active_missions': Role.objects.filter(mission__company=user.company, student__isnull=False).count(),
            'waiting_applications': Application.objects.filter(mission__company=user.company, status='pending').count(),
            'students_hired': Role.objects.filter(mission__company=user.company, student__isnull=False).values("student").distinct().count(),
            'all_missions': Mission.objects.filter(company=user.company).count()
        }

        # Make profile
        profile = {
            'status': 'free',
            'validated': user.company.is_active,
            'picture': user.company.picture.url
        }

        # Make charts
        stats = {
            'missions_per_month': get_missions_per_month(user),
            'applications_rate': get_applications_rate(user)
        }
        
        data = {
            'header': header,
            'profile': profile,
            'stats': stats
        }

        return Response(data)

class CreateMission(APIView):

    """
    Docstring for CreateMission
    """

    permission_classes = [IsAuthenticated, IsCompany, IsValidatedCompany]

    def post(self, request: Request):
        serializer = NewMissionSerializer(data=request.data, context={'request': request})
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({
            'msg': "Mission successfully created"
        }, status=201)

class Missions(APIView):
    """
    Docstring for Missions
    """
    permission_classes = [IsAuthenticated, IsCompany]

    def get(self, request: Request):
        user = request.user
        validated_missions = MissionCardSerializer(user.company.missions, many=True).data
        return Response({
            'missions': validated_missions
        })

class MissionDetails(APIView):
    """
    Docstring for MissionDetails
    """
    permission_classes = [IsAuthenticated, IsCompany]

    def get(self, request: Request, uuid):
        user = request.user
        try:
            mission = Mission.objects.get(uuid=uuid, company=user.company)
        except (Mission.DoesNotExist, ValidationError):
            return Response({
                'detail': 'mission not found'
            }, status=404)
        parsed_mission = MissionDetailsSerializer(mission).data
        parsed_applications = ApplicationSerializer(mission.applications, many=True).data

        return Response({
            'mission': parsed_mission,
            'applications': parsed_applications
        })
        
        

    def put(self, request: Request, uuid):
        user = request.user
        try:
            mission = Mission.objects.get(uuid=uuid, company=user.company)
        except (Mission.DoesNotExist, ValidationError):
            return Response({
                'detail': 'mission not found'
            }, status=404)
        serializer = MissionEditSerializer(data=request.data, instance=mission)
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({
            'msg': 'successfully updated'
        })
    
    def delete(self, request: Request, uuid):
        pass

class MissionApplications(APIView):
    """
    Docstring for MissionApplications
    """
    permission_classes = [IsAuthenticated, IsCompany, IsValidatedCompany]
    
    def get(self, request: Request, uuid):
        pass

class EditApplication(APIView):
    """
    Docstring for EditApplication
    """
    permission_classes = [IsAuthenticated, IsCompany, IsValidatedCompany]

    def put(self, request: Request, uuid, app_id):
        user = request.user
        try:
            mission = Mission.objects.get(uuid=uuid, company=user.company)
        except (Mission.DoesNotExist, ValidationError):
            return Response({
                'detail': 'mission not found'
            }, status=404)
        
        try:
            application = mission.applications.get(id=app_id, student__isnull=False)
        except (Application.DoesNotExist, ValidationError):
            return Response({
                'detail': 'application not found'
            }, status=404)
        status = request.data.get('status', None)
        if (not status):
            return Response({
                'status': 'Status required'
            }, status=400)
        if (status not in ['confirmed', 'not-validated']):
            return Response({
                'status': 'Invalid status'
            }, status=400)
        if (status == 'confirmed' and mission.applications.filter(status='confirmed').exists()):
            return Response({
                'detail': 'already confirmed another application'
            }, status=400)
        
        with transaction.atomic():
            application.status = status
            if (status == 'confirmed'):
                mission.status = 'in_progress'
                mission.save()
                Role.objects.get_or_create(student=application.student, mission=mission)
                student = application.student
                already_owned_skills = student.skills.filter(skill__name__in=mission.skills).values_list('skill__name', flat=True)
                skills_to_add = set(mission.skills) - set(already_owned_skills)

                if (skills_to_add):
                    raw_skills = Skill.objects.filter(name__in=skills_to_add)
                    new_wrappers = [
                        SkillWrapper(skill=skill, student=student)
                        for skill in raw_skills
                    ]
                    SkillWrapper.objects.bulk_create(new_wrappers)
                
                # Send notification
                if (application.student):
                    alert_context = {
                        'mission_uuid': str(mission.uuid),
                        'application_status': status
                    }
                    alert = Notification.objects.create(
                        verb_key="APPLICATION_RESPONSE",
                        context_data=alert_context,
                        user=application.student.user
                    )
                    trigger_notification(application.student.user.uuid, AlertSerializer(alert).data)
            application.save()
        return Response({
            'msg': 'successfully updated',
            'applications': ApplicationSerializer(mission.applications, many=True).data
        })

class RateMission(APIView):
    """
    Docstring for RateMission
    """
    permission_classes = [IsAuthenticated, IsCompany, IsValidatedCompany]

    def post(self, request: Request, uuid):
        pass

    def put(self, request: Request, uuid):
        pass

# Profile

class CompanyProfile(APIView):
    """
    Docstring for CompanyProfile
    """
    permission_classes = [IsAuthenticated, IsCompany]

    def get(self, request: Request):
        user = request.user
        return Response({
            'profile': CompanyUserProfileSerializer(user).data
        })

    def patch(self, request: Request):
        user = request.user
        serializer = AccountSerializer(
            data=request.data,
            instance=user,
            context={
                'user': user
            }
        )
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({
            'msg': 'account successfully updated'
        })

class SetCompanyKYC(APIView):
    """
    Docstring for AddCompanyKYC
    """
    permission_classes = [IsAuthenticated, IsCompany]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request: Request):
        user = request.user
        if (hasattr(user.company, 'kyc')):
            return Response({
                'detail': ['kyc already set']
            }, status=400)
        serializer = CompanyKYCSerializer(data=request.data, context={
            'user': user
        })
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({
            'msg': 'kyc successfully set',
            'kyc': serializer.data
        })

    def put(self, request: Request):
        user = request.user
        if (not hasattr(user.company, 'kyc')):
            return Response({
                'detail': ['no kyc available']
            }, status=400)
        kyc = getattr(user.company, 'kyc')

        serializer = CompanyKYCSerializer(
            data=request.data,
            instance=kyc
        )
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({
            'msg': 'kyc successfully updated',
            'kyc': serializer.data
        })
        
