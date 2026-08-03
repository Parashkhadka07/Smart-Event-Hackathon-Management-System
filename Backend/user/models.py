from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
# Create your models here.
class User(AbstractUser):
   
    first_name = None
    last_name = None
    fullname=models.CharField(max_length=100,null=True)
    ROLE_CHOICES={
        "P":"participant",
        "J":"judge",
        "E":"employee"
    }
    id=models.UUIDField(default=uuid.uuid4,primary_key=True,editable=False)
    role=models.CharField(choices=ROLE_CHOICES,max_length=12 )

class token(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    OTP=models.TextField(unique=True)
