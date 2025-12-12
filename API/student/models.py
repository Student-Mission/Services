from django.db import models
from user_auth.models import MissionUser
from mission_admin.models import Skill
from django.utils import timezone
import uuid

class Student(models.Model):
    LEVELS = (
        ('Rookie', 'Rookie'),
        ('Apprentice', 'Apprentice'),
        ('Intermediate', "Intermediate"),
        ('Challenger', "Challenger"),
        ('Expert', "Expert"),
        ('Master', "Master"),
        ('Senior', "Senior")
    )

    bio = models.TextField(null=True, blank=True)
    level = models.CharField(max_length=100, choices=LEVELS, default='Rookie')
    global_rate = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=False)
    user = models.OneToOneField(MissionUser, on_delete=models.CASCADE, related_name='student')

class StudentKYC(models.Model):
    KYC_STATUS = (
        ('not-validated', "Not validated"),
        ('in_progress', "In progress"),
        ('validated', 'Validated')
    )

    title = models.CharField(max_length=100)
    document_url = models.TextField()
    status = models.CharField(max_length=90, choices=KYC_STATUS, default='in_progress')
    submitted_at = models.DateField(auto_now_add=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='kycs')

    @property
    def submitted_elapsed_time(self):
        today = timezone.localdate()
        days = (today - self.submitted_at).days
        return days if days >= 0 else 0

class SkillWrapper(models.Model):
    mission_rate = models.FloatField(default=0.0)
    test_rate = models.FloatField(default=0.0)
    skill = models.ForeignKey(Skill, on_delete=models.SET_NULL, null=True, related_name='wrappers')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='skills')

class SkillTest(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    file = models.FileField(upload_to='tests/')
    rate = models.FloatField(default=0.0)
    ended = models.BooleanField(default=False)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    skill = models.ForeignKey(SkillWrapper, on_delete=models.CASCADE, related_name="tests")
