from .models import User,token
from rest_framework import serializers

class UserSerilizer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email','password','role']