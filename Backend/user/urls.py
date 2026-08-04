from django.urls import path
from . import views

urlpatterns=[
    path("users/<str:id>",views.users)
]