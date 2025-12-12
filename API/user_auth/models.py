from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import MissionUserManager
import uuid

class MissionUser(AbstractBaseUser):
    USER_TYPES = (
        ('student', 'Student'),
        ('company', 'Company'),
        ('admin', 'Admin'),
        ('support', 'Support'),
        ('developer', 'Developer')
    )

    uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=200, unique=True)
    picture_url = models.TextField(null=True, blank=True, verbose_name='User profile picture')
    user_type = models.CharField(max_length=50, choices=USER_TYPES)
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de mise à jour")
    password_changed = models.BooleanField(default=False)

    REQUIRED_FIELDS = ["username", "role"]
    USERNAME_FIELD = "email"

    objects = MissionUserManager()

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    def __str__(self):
        return self.username