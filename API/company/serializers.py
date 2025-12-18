from rest_framework import serializers
from .models import Mission, Company, CompanyKYC
from mission_admin.models import Skill
from user_auth.models import MissionUser
from django.db.models import Q

class NewMissionSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )
    start_date = serializers.DateField()
    deadline = serializers.DateField()
    company = serializers.SerializerMethodField()
    class Meta:
        model = Mission
        fields = ['name', 'description', 'level', 'render_link', 'skills', 'start_date', 'deadline']


    def validate(self, data: dict):
        data = super().validate(data)
        skills = data.get('skills')

        found_skills = Skill.objects.filter(name__in=skills)
        if (len(found_skills) != len(skills)):
            raise serializers.ValidationError({'skills': 'invalid skills'})
        return data

    def create(self, validated_data):
        request = self.context.get('request', None)
        if (not request):
            raise serializers.ValidationError({'detail': 'Request context not found'})
        
        company = request.user.company
        validated_data['company'] = company
        return Mission.objects.create(**validated_data)

class CompanySerializer(serializers.ModelSerializer):
    uuid = serializers.ReadOnlyField()
    kyc = serializers.SerializerMethodField()
    class Meta:
        model = Company
        exclude = ['user', 'is_active']
    
    def get_kyc(self, obj: Company):
        kyc = None
        if hasattr(obj, 'kyc'):
            kyc = {
                'title': obj.kyc.title,
                'document_url': obj.kyc.document_url,
                'status': obj.kyc.status
            }
        return kyc
    
class AccountSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=50, required=False)
    description = serializers.CharField(max_length=400, required=False)
    picture = serializers.ImageField(required=False)
    email = serializers.EmailField(required=False)
    username = serializers.CharField(max_length=30, required=False)
    class Meta:
        model = MissionUser
        fields = ['email', 'username', 'name', 'description', 'picture']
    
    def validate(self, data: dict):
        user = self.context.get('user')
        data = super().validate(data)
        name = data.get('name')
        if (Company.objects.filter(Q(name=name) & ~Q(pk=user.company.pk)).exists()):
            raise serializers.ValidationError({'detail': 'A company with this name already exists'})
        return data
    
    def update(self, instance:MissionUser, validated_data: dict):
        # Update user
        if (validated_data.get('email')):
            instance.email = validated_data.pop('email')
        if (validated_data.get('username')):
            instance.username = validated_data.pop('username')
        instance.save()
        company = instance.company
        # Update company
        if (validated_data.get('name')):
            company.name = validated_data.pop('name')
        if (validated_data.get('description')):
            company.description = validated_data.pop('description')
        if (validated_data.get('picture')):
            company.picture.delete(save=False)
            company.picture = validated_data.pop('picture')
        company.save()
        return instance

class CompanyKYCSerializer(serializers.ModelSerializer):
    updated_at = serializers.DateTimeField(read_only=True, required=False)
    status = serializers.CharField(read_only=True, required=False)
    class Meta:
        model = CompanyKYC
        fields = ['title', 'document', 'status', 'updated_at']
    
    def create(self, validated_data: dict):
        user = self.context.get('user')
        title = validated_data.pop('title')
        document = validated_data.pop('document')
        kyc = CompanyKYC.objects.create(
            title=title,
            document=document,
            company=user.company
        )
        return kyc

    def update(self, instance, validated_data: dict):
        title = validated_data.pop('title')
        document = validated_data.pop('document')
        instance.title = title
        instance.document.delete(save=False)
        instance.document = document
        instance.status = 'pending'
        instance.save()
        return instance

# Display


class CompanyUserProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    picture = serializers.SerializerMethodField()
    kyc = serializers.SerializerMethodField()
    class Meta:
        model = MissionUser
        fields = ['email', 'username', 'name', 'description', 'picture', 'kyc']
    
    def get_picture(self, obj):
        return obj.company.picture.url
    
    def get_name(self, obj):
        return obj.company.name
    
    def get_description(self, obj):
        return obj.company.description
    
    def get_kyc(self, obj):
        company = obj.company
        if (not hasattr(company, 'kyc')):
            return None
        kyc = getattr(company, 'kyc')
        return CompanyKYCSerializer(kyc).data

class MissionCardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Mission
        fields = ['uuid', 'name', 'description', 'level', 'skills', 'status', 'start_date']
