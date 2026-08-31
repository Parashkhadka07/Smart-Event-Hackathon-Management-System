from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns=[
    path("users/",views.Users.as_view()),
    path("users/<uuid:id>",views.Single_user.as_view()),
    path("otp/",views.Token.as_view()),
    path("otp/<uuid:id>/",views.Token_one.as_view()),
     path("login/", TokenObtainPairView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
