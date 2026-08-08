from .models import User,token
from rest_framework import serializers

class UserSerilizer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model=User
        fields=['id','username','email','password','role']

class TokenSerilizer(serializers.ModelSerializer):
    class Meta:
        model=token
        fields='__all__'

