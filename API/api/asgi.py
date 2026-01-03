"""
ASGI config for api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
import django
import environ
from pathlib import Path
from django.core.asgi import get_asgi_application

# Initialize env
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Set default settings module
env_type = env("ENV", default='local')
if (env_type == 'production'):
    settings_module = "api.settings.production"
else:
    settings_module = "api.settings.local"

os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
django.setup()

# Others imports
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django_channels_jwt.middleware import JwtAuthMiddlewareStack
from users.routing import websocket_urlpatterns


application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': JwtAuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    )
})
