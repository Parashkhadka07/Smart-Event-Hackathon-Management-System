from django.urls import path
from . import views

urlpatterns=[
    path("users/",views.users),
    path("otp/",views.Token.as_view())
]