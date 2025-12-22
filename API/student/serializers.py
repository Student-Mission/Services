from rest_framework import serializers
from company.models import Mission, Company, Role
from user_auth.models import MissionUser
from mission_admin.models import Skill
from .models import SkillWrapper, StudentKYC, SkillTest
from .utils import compute_skill_rate
from django.db import transaction
from django.db.models import Q

class MissionCardSerializer(serializers.ModelSerializer):

    company = serializers.SerializerMethodField()

    class Meta:
        model = Mission
        fields = ['name', 'description', 'uuid', 'level', 'company']

    def get_component(self, obj):
        if (not hasattr(obj, 'company')):
            return {}
        company = getattr(obj, 'company')
        return {
            'name': company.name,
            'picture': company.picture_url,
            'uuid': company.uuid
        }

class MissionHistoryCardSerializer(serializers.ModelSerializer):
    
    company = serializers.SerializerMethodField()
    mission = serializers.SerializerMethodField()
    class Meta:
        model = Role
        fields = ['company', 'mission']
    
    def get_company(self, obj: Role):
        company = obj.mission.company
        if (not company):
            return {
                'name': 'Unknown',
                'picture': 'none'
            }
        return {
            'name': company.name,
            'picture': company.picture.url
        }
    
    def get_mission(self, obj: Role):
        mission = obj.mission
        return {
            'name': mission.name,
            'deadline': mission.deadline,
            'status': mission.status
        }

class MissionCompanyDetails(serializers.ModelSerializer):
    
    class Meta:
        model = Company
        exclude = ['is_active', 'user']

class MissionDetailsSerializer(serializers.ModelSerializer):

    company = MissionCompanyDetails()
    class Meta:
        model = Mission
        exclude = ['student']

# Profile

class StudentKYCSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentKYC
        fields = ['title', 'document', 'status', 'submitted_at']

class SkillWrapperSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()
    class Meta:
        model = SkillWrapper
        exclude = ['skill', 'student']
    
    def get_name(self, obj: SkillWrapper):
        return obj.skill.name

class StudentProfileDisplaySerializer(serializers.ModelSerializer):
    personal = serializers.SerializerMethodField()
    details = serializers.SerializerMethodField()

    class Meta:
        model = MissionUser
        fields = ['personal', 'details']
    
    def get_personal(self, obj: MissionUser):
        return {
            'username': obj.username,
            'email': obj.email,
            'bio': obj.student.bio,
            'picture': obj.picture.url if (obj.picture) else 'none'
        }

    def get_details(self, obj: MissionUser):
        can_add_proof = True
        student = obj.student
        if (len(student.kycs.all()) == 0):
            pass
        elif (student.kycs.filter(status='in_progress').exists()):
            can_add_proof = False
        else:
            student_proofs = student.kycs.filter(status='validated').order_by('-submitted_at')
            last_proof = student_proofs.first()
            can_add_proof = False if last_proof.submitted_elapsed_time < 320 else True
            
        return {
            'skills': SkillWrapperSerializer(obj.student.skills, many=True).data,
            'level': obj.student.level,
            'global_rate': obj.student.global_rate,
            'status': 'validated' if obj.student.is_active else 'not-validated',
            'profile_completion': 75,
            'can_add_proof': can_add_proof,
            'kycs': StudentKYCSerializer(obj.student.kycs, many=True).data
        }

class StudentProfileEditSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(allow_null=True, max_length=500, required=False)
    username = serializers.CharField(max_length=50, allow_null=False, required=False)
    email = serializers.EmailField(max_length=200, allow_null=False, required=False)
    picture = serializers.ImageField(required=False)
    remove_picture = serializers.BooleanField(required=False)

    class Meta:
        model = MissionUser
        fields = ['picture', 'username', 'email', 'bio', 'remove_picture']
    
    def validate_email(self, value):
        users = MissionUser.objects.exclude(pk=self.instance.pk).filter(email=value)

        if (users.exists()):
            raise serializers.ValidationError('Email already used')
        return value
    
    # def validate_picture(self, value):
    #     if (not value):
    #         return None
    #     if (isinstance(value, str) and value == 'none'):
    #         return value
    #     elif (isinstance(value, str) and value != 'none'):
    #         raise serializers.ValidationError({'picture': 'Invalid email field'})
    #     return value
    
    def update(self, instance, validated_data: dict):
        remove_picture = validated_data.get('remove_picture')
        with transaction.atomic():
            instance.username = validated_data.get('username', instance.username)
            instance.email = validated_data.get('email', instance.email)
            picture = validated_data.get('picture', None)
            if (picture):
                instance.picture.delete(save=False)
                instance.picture = picture
            if ((not picture) and remove_picture):
                instance.picture.delete(save=False)
                instance.picture = None
            
            instance.save()

            student_bio = validated_data.get('bio', None)
            if (student_bio is not None):
                student = instance.student
                student.bio = student_bio
                student.save()
        return instance

class AddSkillSerializer(serializers.Serializer):

    skills = serializers.ListField(child=serializers.CharField(), allow_null=True)

    
    def validate_skills(self, names):
        
        # Check if sended skills exist
        existing_skills = Skill.objects.filter(name__in=names)
        existing_names = set(existing_skills.values_list('name', flat=True))

        invalid_names = set(names) - existing_names

        if (invalid_names):
            raise serializers.ValidationError("Invalid skills")
        return existing_skills

    def create(self, validated_data: dict):
        request = self.context.get('request')
        requested_skills = validated_data.get('skills')
        student = request.user.student

        # Get skill ids student has
        already_owned_ids = SkillWrapper.objects.filter(student=student, skill__in=requested_skills).values_list('skill_id', flat=True)

        # Get skill student don't have
        skills_to_add = [
            skill for skill in requested_skills
            if not skill.id in already_owned_ids
        ]

        if skills_to_add:
            with transaction.atomic():
                new_skill_wrappers = [
                    SkillWrapper(skill=skill, student=student) for skill in skills_to_add
                ]
                SkillWrapper.objects.bulk_create(new_skill_wrappers)
        return student 

class StudentProofSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentKYC
        fields = ['title', 'document']
    
    def create(self, validated_data):
        user = self.context.get('request').user
        
        
        # Create proof
        proof = StudentKYC.objects.create(
            title=validated_data.get('title'),
            document=validated_data.get('document'),
            student=user.student
        )
        return proof

class MakeSkillTestSerializer(serializers.Serializer):
    skill_name = serializers.CharField()

class SkillTestSummarySerializer(serializers.ModelSerializer):

    skill = serializers.SerializerMethodField()
    class Meta:
        model = SkillTest
        fields = ['rate', 'ended', 'created_at', 'updated_at', 'skill']
    
    def get_skill(self, obj: SkillTest):
        return {
            'name': obj.skill.skill.name,
            'mission_rate': obj.skill.mission_rate,
            'test_rate': obj.skill.test_rate,
            'rate': compute_skill_rate(obj.skill.mission_rate, obj.skill.test_rate)
        }
