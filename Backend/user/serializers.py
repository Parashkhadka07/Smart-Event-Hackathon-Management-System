from .models import User, token
from rest_framework import serializers


class UserSerilizer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user


class TokenSerilizer(serializers.ModelSerializer):
    class Meta:
        model = token
        fields = '__all__'