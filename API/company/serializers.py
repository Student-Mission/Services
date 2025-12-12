from rest_framework import serializers
from .models import Mission, Company
from mission_admin.models import Skill

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


# Display
