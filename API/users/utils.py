from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification

def trigger_notification(user_uuid, data: dict):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(f'user_{user_uuid}', {
        'type': 'send_alert',
        'content': {
            'message': "Data refreshed",
            'data': data
        }
    })
