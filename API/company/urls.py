from django.urls import path
from .views import CreateMission
from .views import Dashboard, CompanyProfile, SetCompanyKYC, Missions, MissionDetails, EditApplication

urlpatterns = [
    path('dashboard/', Dashboard.as_view()),
    path('missions/', Missions.as_view()),
    path('missions/<str:uuid>/', MissionDetails.as_view()),
    path('missions/<str:uuid>/applications/<int:app_id>/', EditApplication.as_view()),
    path('profile/', CompanyProfile.as_view()),
    path('profile/kyc/', SetCompanyKYC.as_view()),
    path('create-mission/', CreateMission.as_view()),
]
