from django.urls import path
from .views import Register, Refresh, Login, EditSecurity, GetUser

urlpatterns = [
    path('register/', Register.as_view()),
    path('login/', Login.as_view()),
    path('refresh/', Refresh.as_view()),
    path('user/', GetUser.as_view()),
    path('change-password/', EditSecurity.as_view()),
]
