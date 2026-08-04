from .models import User,token
from rest_framework import serializers

# class UserSerilizer(serializers.ModelSerializer):
#     class meta:
#         model=User
#         fields=['id','username','email']