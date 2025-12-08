from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import MissionUser
from .serializers import RegisterSerializer, LoginSerializer, RefreshSerializer
from .utils import generate_tokens
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenRefreshView

class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        serializer = LoginSerializer(request.data)

        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        user = serializer.validated_data['user']
        return Response(generate_tokens(user))

class Register(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request: Request):
        serializer = RegisterSerializer(request.data)

        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response({
            'msg': 'user created'
        }, status=201)

class Refresh(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request):
        serializer = TokenRefreshSerializer(request.data)

        if (not serializer.is_valid()):
            return Response(serializer.errors, status=400)
        return Response(serializer.validated_data)

class GeneratePasswordRequest(APIView):
    pass
