# from django.shortcuts import render
# from django.http import JsonResponse
from .models import User,token
from .serializers import UserSerilizer,TokenSerilizer
from rest_framework import response
from rest_framework import status
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView        
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


class Token(APIView):
    def get(self,request):
        try:
            Otp_data=token.objects.all()
            serilizer=TokenSerilizer(Otp_data,many=True)
            return response.Response(serilizer.data,status=status.HTTP_200_OK)
        except:
            return response.Response(serilizer.errors,status=status.HTTP_400_BAD_REQUEST)

    
    def post(self, request):
      
        serilizer=TokenSerilizer(data=request.data)
        if serilizer.is_valid():
            serilizer.save()
            return response.Response(serilizer.data,status=status.HTTP_201_CREATED)
        return response.Response(serilizer.errors, status=status.HTTP_400_BAD_REQUEST)

class Token_one(APIView):
    def get_object(self,id):
        return get_object_or_404(token, user=id)
    def get(self,request,id):
        otp = self.get_object(id)
        serilizer=TokenSerilizer(otp)
        return response.Response(serilizer.data,status=status.HTTP_200_OK)
    def put(self,request,id):
        otp=self.get_object(id)
        serilizer=TokenSerilizer(otp,data=request.data)
        if serilizer.is_valid():
            serilizer.save()
            return response.Response(serilizer.data,status=status.HTTP_200_OK)
        return response.Response(serilizer.errors,status=status.HTTP_400_BAD_REQUEST)