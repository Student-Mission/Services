from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from student.serializers import MissionCardSerializer, MissionDetailsSerializer, MissionHistoryCardSerializer
from api.permissions import IsStudent, IsValidatedStudent
from rest_framework.permissions import IsAuthenticated
from company.models import Mission, Application
from student.config import LEVELS
from django.core.exceptions import ValidationError

class Dashboard(APIView):
    """
    Docstring for Dashboard
    """

    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request: Request):
        user = request.user
        student = user.student
        
        # Get profile
        profile = {
            'username': user.username,
            'global_rate': student.global_rate,
            'level': student.level,
            'picture': user.picture.url if user.picture else 'none'
        }
        # Get recommended missions
        recommended_missions = MissionCardSerializer(Mission.objects.filter(status='not_started', level=student.level)[:3], many=True).data
        # Get history
        history = MissionHistoryCardSerializer(student.roles.all()[:3], many=True).data
        return Response({
            'missions': recommended_missions,
            'profile': profile,
            'current_missions': history
        })

# Missions
class Missions(APIView):
    """
    Docstring for Missions
    """
    permission_classes = [IsAuthenticated, IsStudent]
    def get(self, request: Request):
        user = request.user

        # Level management
        current_level = user.student.level
        try:
            current_level_index = LEVELS.index(current_level)
        except ValueError:
            current_level = 'Rookie'
            current_level_index = 0
        start_index = current_level_index - 1 if current_level_index > 0 else 0
        end_index = current_level_index + 1 if current_level_index < len(LEVELS) else len(LEVELS) - 1
        selected_levels = LEVELS[start_index:end_index+1]

        # Filter suggested missions
        missions = Mission.objects.filter(status='not_started', level__in=selected_levels).exclude(applications__student=user.student).select_related('company').order_by('?')[:30]
        parsed_missions = MissionCardSerializer(missions, many=True).data
        return Response({
            'missions': parsed_missions
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
        except (Mission.DoesNotExist, ValidationError):
            return Response({
                'detail': "mission not found"
            }, status=404)
        return Response({
            'mission': MissionDetailsSerializer(mission, context={
                'request': request
            }).data
        })

class ApplyToMission(APIView):
    """
    Docstring for ApplyToMission
    """

    permission_classes = [IsAuthenticated, IsStudent, IsValidatedStudent]

    def post(self, request: Request, uuid):
        user = request.user
        try:
            mission = Mission.objects.get(uuid=uuid)
        except (Mission.DoesNotExist, ValidationError):
            return Response({
                'detail': "mission not found"
            }, status=404)
        applications = Application.objects.filter(student=user.student, mission=mission)
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
