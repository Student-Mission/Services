from .models import MissionUser
from rest_framework_simplejwt.tokens import RefreshToken

def generate_tokens(user: MissionUser):
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    return {
        'access': access,
        'refresh': str(refresh)
    }
