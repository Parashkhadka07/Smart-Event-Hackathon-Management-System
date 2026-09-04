from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid


class User(AbstractUser):
    ROLE_CHOICES = [
        ("participant", "participant"),
        ("judge", "judge"),
        ("organizer", "organizer"),
    ]

    email = models.EmailField(unique=True)
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="participant")


class token(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    OTP = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now=True)
