from django.urls import path
from student.views import mission, profile

urlpatterns = [
    # Mission
    path('dashboard/', mission.Dashboard.as_view()),
    path('missions/', mission.Missions.as_view()),
    path('missions/<str:uuid>/', mission.MissionDetails.as_view()),
    path('missions/<str:uuid>/', mission.ApplyToMission.as_view()),

    # Profile
    path('profile/', profile.Profile.as_view()),
    path('profile/skills/', profile.AddSkills.as_view()),
    path('profile/kyc/', profile.ManageKYC.as_view()),
    path('profile/skills/make-test/', profile.MakeTest.as_view()),
    path('profile/skills/tests/<str:uuid>/', profile.TestManagement.as_view())
]

