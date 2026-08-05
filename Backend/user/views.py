# from django.shortcuts import render
# from django.http import JsonResponse
from .models import User
from .serializers import UserSerilizer
from rest_framework import response
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
# Create your views here.
@api_view(['GET','POST'])
def users(request):
    if request.method=='GET':
        student=User.objects.all()
        serilizer=UserSerilizer(student,many=True)
        return response.Response(serilizer.data,status=status.HTTP_200_OK)
        
    elif request.method=='POST':
        serilizer=UserSerilizer(data=request.data)
        if serilizer.is_valid():
            serilizer.save()
            return response.Response(serilizer.data,status=status.HTTP_201_CREATED)
        return response.Response(serilizer.errors,status=status.HTTP_400_BAD_REQUEST)