from django.urls import path
from .views import Register, Refresh, Login

urlpatterns = [
    path('register/', Register.as_view()),
    path('login/', Login.as_view()),
    path('refresh/', Refresh.as_view())
]
