from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import MissionUser
from .serializers import RegisterSerializer, LoginSerializer, SecuritySerializer
from .utils import generate_tokens
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from rest_framework.parsers import FormParser, MultiPartParser
from mission_admin.serializers import SkillListSerializer
from mission_admin.models import Skill

class Login(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={200: dict},
        description="Login and get JWT tokens."
    )

    def post(self, request: Request):
        serializer = LoginSerializer(data=request.data)

        if (serializer.is_valid() == False):
            return Response(serializer.errors, status=400)
        user = serializer.validated_data['user']
        data = generate_tokens(user)
        data['type'] = user.user_type
        data['profile'] = {
            'username': user.username,
            'email': user.email,
            'picture': user.picture.url if user.picture else 'none'
        }
        data['available_skills'] = SkillListSerializer(Skill.objects.all(), many=True).data
        return Response(data)

class Register(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    @extend_schema(
        request={
            'multipart/form-data': RegisterSerializer
        },
        responses={201: {"type": "object", "properties": {"msg": {"type": "string"}}}},
        description="New user signup."
    )
    
    def post(self, request: Request):
        serializer = RegisterSerializer(data=request.data)

        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({
            'msg': 'user created'
        }, status=201)

class Refresh(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        serializer = TokenRefreshSerializer(data=request.data)

        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        return Response(serializer.validated_data)

class EditSecurity(APIView):
    """
    Docstring for EditSecurity
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=SecuritySerializer,
        responses={
            200: OpenApiTypes.OBJECT, # On indique que la réponse est un objet
        },
        examples=[
            OpenApiExample(
                'Succès',
                value={'msg': 'security successfully updated'},
                response_only=True,
            )
        ],
        description="Met à jour les paramètres de sécurité de l'utilisateur connecté."
    )

    def put(self, request: Request):
        serializer = SecuritySerializer(
            data=request.data,
            instance=request.user,
            context={
                'request': request
            }
        )
        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({
            'msg': 'security successfully updated'
        })

class GetUser(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        user = request.user
        data = {
            'profile': {
                'username': user.username,
                'email': user.email,
                'picture': user.picture.url if user.picture else 'none'
            },
            'available_skills': SkillListSerializer(Skill.objects.all(), many=True).data
        }
        return Response(data)

class GeneratePasswordRequest(APIView):
    pass
