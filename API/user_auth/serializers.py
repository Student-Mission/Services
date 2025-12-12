from rest_framework import serializers
from .models import MissionUser
from django.db import transaction
from student.models import Student
from company.models import Company
from django.contrib.auth.hashers import check_password

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50, required=False)
    description = serializers.CharField(required=False)
    picture_url = serializers.CharField(required=False)

    class Meta:
        model = MissionUser
        fields = ['username', 'email', 'password', 'user_type', 'name', 'description', 'picture_url']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data: dict):
        user_type = data.get('user_type')
        email = data.get('email')
        username = data.get('username')
        
        users = MissionUser.objects.filter(email=email, username=username)
        if (users.exists()):
            user = users.first()
            if (user.email == email):
                raise serializers.ValidationError({'email': 'account with this email exists'})
            else:
                raise serializers.ValidationError({'username': 'account with this username exists'})

        if (user_type == 'company'):
            for field in ['name', 'description', 'picture_url']:
                if not data.get(field):
                    raise serializers.ValidationError({field: f'{field} field is required'})
        if (user_type not in ['company', 'student']):
            raise serializers.ValidationError({'user_type', 'Invalid user type'})
        return data
        
    @transaction.atomic
    def create(self, validated_data: dict):
        user_type = validated_data.pop('user_type')
        password = validated_data.pop('password')

        # Create user
        user = MissionUser.objects.create_user(
            username=validated_data.pop('username'),
            email=validated_data.pop('email'),
            password=password,
            user_type=user_type
        )

        # Profile creation
        if (user_type == 'student'):
            Student.objects.create(user=user)
        elif (user_type == 'company'):
            Company.objects.create(
                user=user,
                name=validated_data.pop('name'),
                description=validated_data.pop('description'),
                picture_url=validated_data.pop('picture_url')
            )
        return user
        
class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data: dict):
        email = data.get('email')
        password = data.get('password')

        try:
            user = MissionUser.objects.get(email=email)
        except MissionUser.DoesNotExist:
            raise serializers.ValidationError({'detail': 'Invalid credentials'})
        if (not check_password(password, user.password)):
            raise serializers.ValidationError({'detail': 'Invalid credentials'})
        data['user'] = user
        return data
