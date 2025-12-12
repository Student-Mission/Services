from rest_framework import serializers
from company.models import Mission, Company
from user_auth.models import MissionUser
from mission_admin.models import Skill
from .models import SkillWrapper, StudentKYC

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
        fields = ['title', 'document_url', 'status']

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
            'picture_url': obj.picture_url
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
    bio = serializers.CharField(allow_null=True, max_length=500)
    username = serializers.CharField(max_length=50, allow_null=False)
    email = serializers.EmailField(max_length=200, allow_null=False)
    picture_url = serializers.CharField(allow_null=False)

    class Meta:
        model = MissionUser
        fields = ['picture_url', 'username', 'email', 'bio']
    
    def validate_email(self, value):
        users = MissionUser.objects.exclude(pk=self.instance.pk).filter(email=value)

        if (users.exists()):
            raise serializers.ValidationError({'email': 'Email already used'})
        return value
    
    def update(self, instance, validated_data: dict):
        instance.username = validated_data.get('username')
        instance.email = validated_data.get('email')
        instance.picture_url = validated_data.get('picture_url')
        instance.save()

        student_bio = validated_data.get('bio', None)
        if (student_bio is not None):
            student = instance.student
            student.bio = student_bio
            student.save()
        return instance

class AddSkillSerializer(serializers.ModelSerializer):

    name = serializers.CharField()

    class Meta:
        model = SkillWrapper
        fields = ['name']
    
    def validate(self, data: dict):
        name = data.get('name', None)
        
        # Check field validity
        if (name is None):
            raise serializers.ValidationError({'name': 'name field required'})
        
        # Check if skill exists
        try:
            raw_skill = Skill.objects.get(name=name)
        except Skill.DoesNotExist:
            raise serializers.ValidationError({'detail': "invalid skill"})
        
        # Get context
        request = self.context.get('request')
        user = request.user

        # Check if skill were already added
        if (SkillWrapper.objects.filter(skill=raw_skill, student=user.student).exists()):
            raise serializers.ValidationError({'detail': 'skill already added'})
        
        return data
    
    def create(self, validated_data: dict):
        name = validated_data.pop('name')
        request = self.context.get('request')
        user = request.user

        # Get raw skill
        try:
            raw_skill = Skill.objects.get(name=name)
        except Skill.DoesNotExist:
            pass

        # Create skill wrapper
        skill_wrapper = SkillWrapper.objects.create(
            skill=raw_skill,
            student=user.student
        )
        return skill_wrapper

class StudentProofSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentKYC
        fields = ['title', 'document_url']
    
    def create(self, validated_data):
        user = self.context.get('request').user
        
        
        # Create proof
        proof = StudentKYC.objects.create(
            title=validated_data.get('title'),
            document_url=validated_data.get('document_url'),
            student=user.student
        )
        return proof
