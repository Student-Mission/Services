from django.urls import path
from .views import CreateMission

urlpatterns = [
    path('create-mission/', CreateMission.as_view()),
]

