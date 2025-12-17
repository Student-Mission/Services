from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsCompany, IsValidatedCompany
from .models import Mission, Role, Application
from .serializers import NewMissionSerializer
# from .serializers import MissionCardSerializer
from django.db.models import Q
from django.utils import timezone
from datetime import datetime
from .utils import get_applications_rate, get_missions_per_month
from .serializers import CompanyUserProfileSerializer, AccountSerializer, CompanyKYCSerializer
from rest_framework.parsers import FormParser, MultiPartParser
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
        serializer = NewMissionSerializer(request.data, context={'request': request})
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
    permission_classes = [IsAuthenticated, IsCompany, IsValidatedCompany]

    def get(self, request: Request, uuid):
        try:
            mission = Mission.objects.get(uuid=uuid)
        except Mission.DoesNotExist:
            return Response({
                'detail': 'mission not found' 
            })
        

    def put(self, request: Request, uuid):
        pass
    
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
        pass

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
        
