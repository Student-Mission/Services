from django.db import models
from auth.models import MissionUser

class Student(models.Model):
    bio = models.TextField(null=True, blank=True)
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
    status = models.CharField(max_length=90, choices=KYC_STATUS)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='kycs')
