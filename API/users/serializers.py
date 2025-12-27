from rest_framework import serializers
from .models import Notification

class AlertSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Notification
        exclude = ['user']
