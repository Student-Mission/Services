from django.db import models
from user_auth.models import MissionUser
from student.models import Student
from django.contrib.postgres.fields import ArrayField
import uuid

class Company(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    picture_url = models.TextField()
    is_active = models.BooleanField(default=False)
    user = models.OneToOneField(MissionUser, on_delete=models.CASCADE, related_name='company')

class CompanyKYC(models.Model):
    KYC_STATUS = (
        ('not-validated', "Not validated"),
        ('in_progress', "In progress"),
        ('validated', 'Validated')
    )
    title = models.CharField(max_length=100)
    document_url = models.TextField()
    status = models.CharField(max_length=90, choices=KYC_STATUS)
    company = models.OneToOneField(Company, on_delete=models.CASCADE, related_name='kyc')

class Mission(models.Model):

    STATUS = (
        ('not_started', "Not started"),
        ('in_progress', 'In progress'),
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
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, related_name="missions")

class Application(models.Model):

    STATUS = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('not-validated', "Not validated")
    )

    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS, default='pending')
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, verbose_name='applications')
    mission = models.ForeignKey(Mission, on_delete=models.CASCADE, verbose_name="applications")
