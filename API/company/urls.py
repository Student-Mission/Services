from django.urls import path
from .views import CreateMission
from .views import Dashboard, CompanyProfile, SetCompanyKYC

urlpatterns = [
    path('dashboard/', Dashboard.as_view()),
    path('profile/', CompanyProfile.as_view()),
    path('profile/kyc/', SetCompanyKYC.as_view()),
    path('create-mission/', CreateMission.as_view()),
]
