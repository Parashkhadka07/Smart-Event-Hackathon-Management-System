from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User ,token

class CustomUserAdmin(admin.ModelAdmin):
    model = User
    list_display = ['id', 'username', 'email','password',  'role']
    search_fields = ['username', 'email']

admin.site.register(User, CustomUserAdmin)

class Otp_admin(admin.ModelAdmin):
    model=token
    list_display=['user','OTP']
    search_fields=['username']

admin.site.register(token,Otp_admin)