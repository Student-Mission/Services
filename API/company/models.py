from django.db import models
from user_auth.models import MissionUser
from student.models import Student
from django.contrib.postgres.fields import ArrayField
import uuid
from api.utils import rename_upload, document_rename_upload
from django.utils import timezone


class Company(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    picture = models.ImageField(verbose_name='Company picture', upload_to=rename_upload)
    is_active = models.BooleanField(default=False)
    user = models.OneToOneField(MissionUser, on_delete=models.CASCADE, related_name='company')

class CompanyKYC(models.Model):
    KYC_STATUS = (
        ('not-validated', "Not validated"),
        ('pending', "Pending"),
        ('validated', 'Validated')
    )
    title = models.CharField(max_length=100)
    # document_url = models.TextField()
    document = models.FileField(null=True, default=None, upload_to=document_rename_upload)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=90, choices=KYC_STATUS, default='pending')
    company = models.OneToOneField(Company, on_delete=models.CASCADE, related_name='kyc')

class Mission(models.Model):

    STATUS = (
        ('not_started', "Not started"),
        ('in_progress', 'In progress'),
        ('waiting_for_rate', 'Waiting for rate'),
        ('completed', "Completed")
    )

    LEVELS = (
        ('Rookie', 'Rookie'),
        ('Apprentice', 'Apprentice'),
        ('Intermediate', "Intermediate"),
        ('Challenger', "Challenger"),
        ('Expert', "Expert"),
        ('Master', "Master"),
        ('Senior', "Senior")
    )

    uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    name = models.CharField(verbose_name="Mission name", max_length=100)
    description = models.TextField()
    level = models.CharField(max_length=50, choices=LEVELS)
    skills = ArrayField(models.TextField(), verbose_name='Skills', blank=True, default=list)
    status = models.CharField(max_length=50, choices=STATUS, default='not_started')
    render_link = models.TextField(verbose_name="Render Link")
    
    start_date = models.DateField()
    deadline = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, related_name="missions")
    # student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, related_name="missions")

class Role(models.Model):
    quality_rate = models.FloatField(default=0.0) # 0 to 10
    deadline_rate = models.FloatField(default=0.0)
    communication_rate = models.FloatField(default=0.0)
    rate = models.FloatField(default=0.0)
    quality_feedback = models.TextField(null=True, blank=True)
    deadline_feedback = models.TextField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name="roles")
    mission = models.OneToOneField(Mission, on_delete=models.CASCADE, related_name="role")

class Application(models.Model):
    STATUS = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('not-validated', "Not validated")
    )

    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=50, choices=STATUS, default='pending')
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, verbose_name='Related student', related_name='applications')
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, verbose_name="Related mission", related_name='applications')
