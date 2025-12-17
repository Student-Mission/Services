from rest_framework import serializers
from .models import MissionUser
from django.db import transaction
from student.models import Student
from company.models import Company
from django.contrib.auth.hashers import check_password
from student.utils import make_file

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50, required=False)
    description = serializers.CharField(required=False)
    picture = serializers.ImageField(required=False)

    class Meta:
        model = MissionUser
        fields = ['username', 'email', 'password', 'user_type', 'name', 'description', 'picture']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data: dict):
        data = super().validate(data)
        user_type = data.get('user_type')
        email = data.get('email')
        username = data.get('username')
        
        users = MissionUser.objects.filter(email=email)
        if (users.exists()):
            raise serializers.ValidationError({'email': 'account with this email exists'})
            
        if (user_type == 'company'):
            for field in ['name', 'description', 'picture']:
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
                picture=validated_data.pop('picture')
            )
        return user
        
class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data: dict):
        data = super().validate(data)
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
    class Meta:
        model = MissionUser
        fields = ['email', 'password']

class SecuritySerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=7)

    class Meta:
        model = MissionUser
        fields = ['old_password', 'new_password']

    def validate(self, data: dict):
        data = super().validate(data)
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        user = self.context.get('request').user
        if (user.check_password(old_password) == False):
            raise serializers.ValidationError({'detail': 'bad credentials'})
        if (old_password == new_password):
            raise serializers.ValidationError({'detail': 'passwords must not be the same'})
        return data
    
    def update(self, instance: MissionUser, validated_data):
        new_password = validated_data.get('new_password')
        # user = self.context.get('request').user
        instance.set_password(new_password)
        instance.save()
        return instance
