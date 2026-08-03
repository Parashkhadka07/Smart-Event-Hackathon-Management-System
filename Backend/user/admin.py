from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['id', 'username', 'email',  'role']
    search_fields = ['username', 'email']

admin.site.register(User, CustomUserAdmin)
