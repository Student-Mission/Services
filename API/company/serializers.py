from rest_framework import serializers
from .models import Mission, Company, CompanyKYC, Application, Role
from mission_admin.models import Skill
from user_auth.models import MissionUser
from django.db.models import Q
from student.models import SkillWrapper
from .utils import update_skills_proficiency, update_student_global_rate

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
        fields = ['name', 'description', 'level', 'render_link', 'skills', 'start_date', 'deadline', 'company']


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

class MissionEditSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )
    
    class Meta:
        model = Mission
        fields = ['name', 'description', 'level', 'render_link', 'skills', 'start_date', 'deadline']

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

class MissionDetailsSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    class Meta:
        model = Mission
        exclude = ['company']
    
    def get_role(self, obj: Mission):
        if (not hasattr(obj, 'role')):
            return None
        role = obj.role
        if (not role.student):
            return {
                'bio': '',
                'global_rate': 0,
                'level': 'Unknown',
                'skills': [],
                'user': {
                    'username': 'Unknown',
                    'picture': 'none'
                }
            }
        student = role.student
        return {
            'bio': student.bio,
            'global_rate': student.global_rate,
            'level': student.level,
            'skills': ApplicationUserSkillsSerializer(student.skills, many=True).data,
            'user': {
                'username': student.user.username,
                'picture': student.user.picture.url if student.user.picture else 'none'
            }
        }


class ApplicationUserSkillsSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()
    class Meta:
        model = SkillWrapper
        fields = ['mission_rate', 'test_rate', 'name']
    
    def get_name(self, obj: SkillWrapper):
        if (obj.skill):
            return obj.skill.name
        return ''
    

class ApplicationSerializer(serializers.ModelSerializer):

    student = serializers.SerializerMethodField()
    class Meta:
        model = Application
        exclude = ['mission']
    
    def get_student(self, obj: Application):
        if (not hasattr(obj, 'student')):
            print('Has no student property')
            return {
                'bio': '',
                'global_rate': 0,
                'level': 'Unknown',
                'skills': [],
                'user': {
                    'username': 'Unknown',
                    'picture': 'none'
                }
            }
        student = obj.student
        user = student.user
        return {
            'bio': student.bio,
            'global_rate': student.global_rate,
            'level': student.level,
            'skills': ApplicationUserSkillsSerializer(student.skills, many=True).data,
            'user': {
                'username': user.username,
                'picture': user.picture.url if user.picture else 'none'
            }
        }

class RoleUpdateSerializer(serializers.ModelSerializer):
    quality_feedback = serializers.CharField(required=False)
    deadline_feedback = serializers.CharField(required=False)
    feedback = serializers.CharField(required=False)

    class Meta:
        model = Role
        fields = ['quality_rate', 'deadline_rate', 'quality_feedback', 'deadline_feedback', 'feedback']
    
    def update(self, instance, validated_data: dict):
        instance.quality_rate = validated_data.get('quality_rate')
        instance.deadline_rate = validated_data.get('deadline_rate')

        if (validated_data.get('quality_feedback')):
            instance.quality_feedback = validated_data.get('quality_feedback')
        if (validated_data.get('deadline_feedback')):
            instance.deadline_feedback = validated_data.get('deadline_feedback')
        if (validated_data.get('feedback')):
            instance.feedback = validated_data.get('feedback')
        instance.save()
        
        if (instance.student):
            update_student_global_rate(instance.student)
            update_skills_proficiency(instance)
        return instance
