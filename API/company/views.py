from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsCompany, IsValidatedCompany
from .models import Mission
from .serializers import NewMissionSerializer
from .serializers import MissionCardSerializer

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
# Dashboard
class Dashboard(APIView):
    permission_classes = [IsAuthenticated, IsCompany]
    def get(self, request: Request):
        pass

# Profile

class CompanyProfile(APIView):
    """
    Docstring for CompanyProfile
    """
    permission_classes = [IsAuthenticated, IsCompany]

    def get(self, request: Request):
        pass

    def put(self, request: Request):
        pass

class AddCompanyKYC(APIView):
    """
    Docstring for AddCompanyKYC
    """
    permission_classes = [IsAuthenticated, IsCompany]

    def post(self, request: Request):
        pass
