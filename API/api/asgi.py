"""
ASGI config for api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
import django
# from channels.routing import get_default_application
# from django.core
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django_channels_jwt.middleware import JwtAuthMiddlewareStack
from users.routing import websocket_urlpatterns
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()
application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': JwtAuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    )
})
