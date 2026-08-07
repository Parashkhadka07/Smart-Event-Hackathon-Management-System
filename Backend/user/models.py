from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES={
        "P":"participant",
        "J":"judge",
        "E":"employee"
    }
    id=models.UUIDField(default=uuid.uuid4,primary_key=True,editable=False)
    role=models.CharField(choices=ROLE_CHOICES,max_length=12 )

  
class token(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True)
    OTP=models.CharField( max_length=6)
    created_at=models.DateTimeField(auto_now=True)
