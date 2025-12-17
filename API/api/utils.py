import os
import uuid

def rename_upload(instance, filename):
    ext = filename.split('.')[-1]
    return f"media/{uuid.uuid4()}.{ext}"

def document_rename_upload(instance, filename):
    ext = filename.split('.')[-1]
    return f"media/documents/{uuid.uuid4()}.{ext}"
