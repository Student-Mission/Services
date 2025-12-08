from django.db import models
from auth.models import MissionUser

class Company(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    picture_url = models.TextField()
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
