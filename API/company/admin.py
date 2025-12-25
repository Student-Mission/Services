from django.contrib import admin
from .models import Company, CompanyKYC, Application, Mission

admin.site.register(Company)
admin.site.register(CompanyKYC)
admin.site.register(Application)
admin.site.register(Mission)
