from rest_framework import serializers
from .models import Skill

class SkillListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['name']
    
    def to_representation(self, instance):
        return instance.name