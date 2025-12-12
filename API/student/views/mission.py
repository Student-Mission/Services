from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from student.serializers import MissionCardSerializer, MissionDetailsSerializer
from api.permissions import IsStudent, IsValidatedStudent
from rest_framework.permissions import IsAuthenticated
from company.models import Mission, Application

class Dashboard(APIView):
    """
    Docstring for Dashboard
    """

    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request: Request):
        user = request.user
        profile = {
            'username': user.username,
            'global_rate': 8.3,
            'level': "Rookie",
            'picture': 'none'
        }
        return Response({
            'missions': [],
            'profile': profile,
            'current_missions': []
        })

# Missions
class Missions(APIView):
    """
    Docstring for Missions
    """
    permission_classes = [IsAuthenticated, IsStudent]
    def get(self, request: Request):
        missions = MissionCardSerializer(Mission.objects.filter(status='not_started')[:200], many=True).data
        return Response({
            'missions': missions
        })

class SearchMissions(APIView):
    pass

class MissionDetails(APIView):
    """
    Docstring for MissionDetails
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request: Request, uuid):
        try:
            mission = Mission.objects.get(uuid=uuid)
        except Mission.DoesNotExist:
            return Response({
                'detail': "mission not found"
            }, status=404)
        return Response({
            'mission': MissionDetailsSerializer(mission).data
        })

class ApplyToMission(APIView):
    """
    Docstring for ApplyToMission
    """

    permission_classes = [IsAuthenticated, IsStudent, IsValidatedStudent]

    def get(self, request: Request, uuid):
        user = request.user
        try:
            mission = Mission.objects.get(uuid=uuid)
        except Mission.DoesNotExist:
            return Response({
                'detail': "mission not found"
            }, status=404)
        applications = Application.objects.filter(student=user.student)
        if (applications.exists()):
            return Response({
                'detail': 'Already applied to this mission'
            }, status=403)
        Application.objects.create(
            student=user.student,
            mission=mission
        )
        return Response({
            'msg': 'Successfully applied'
        })
