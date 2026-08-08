from django.urls import path
from . import views

urlpatterns=[
    path("users/",views.Users.as_view()),
    path("otp/",views.Token.as_view()),
    path("otp/<uuid:id>/",views.Token_one.as_view())
]