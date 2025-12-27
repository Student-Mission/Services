from django.db import models
from user_auth.models import MissionUser

# Notification verb keys
# STUDENT_PROOF_NEEDED COMPANY_PROOF_NEEDED EMAIL_VALIDATION_NEEDED SECURITY_UPDATED
# MISSION_UPDATED NEW_APPLICATION APPLICATION_RESPONSE MISSION_SUBMITTED MISSION_RATED

class Notification(models.Model):

    verb_key = models.CharField(max_length=100)
    context_data = models.JSONField(default=dict)

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(MissionUser, on_delete=models.CASCADE, related_name='alerts')
