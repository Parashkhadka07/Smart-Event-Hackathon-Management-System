# from django.shortcuts import render
# from django.http import JsonResponse
from .models import User,token
from .serializers import UserSerilizer,TokenSerilizer
from rest_framework import response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView   
from rest_framework import permissions

# Create your views here.

class Users(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self,request):
        if not request.user.is_authenticated:
            return response.Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        return response.Response(UserSerilizer(request.user).data, status=status.HTTP_200_OK)

    def post(self,request):
        serilizer=UserSerilizer(data=request.data)
        if serilizer.is_valid():
            serilizer.save()
            return response.Response(serilizer.data,status=status.HTTP_201_CREATED)
        return response.Response(serilizer.errors ,status=status.HTTP_400_BAD_REQUEST)

class Single_user(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self,id):
        return get_object_or_404(User, id=id)
    def get(self,request,id):
        if request.user.id != id:
            return response.Response({'detail': 'You can only access your own profile.'}, status=status.HTTP_403_FORBIDDEN)
        serilizer=UserSerilizer(self.get_object(id))
        return response.Response(serilizer.data,status=status.HTTP_200_OK)
    def put(self,request,id):
        if request.user.id != id:
            return response.Response({'detail': 'You can only update your own profile.'}, status=status.HTTP_403_FORBIDDEN)
        old_data=self.get_object(id)
        serilizer=UserSerilizer(old_data,data=request.data)
        if serilizer.is_valid():
            serilizer.save()
            return response.Response(serilizer.data,status=status.HTTP_200_OK)
        return response.Response(serilizer.errors,status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,id):
        return response.Response({'detail': 'Account deletion is not available through this endpoint.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class CurrentUser(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return response.Response(UserSerilizer(request.user).data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = UserSerilizer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            saved_user = serializer.save()
            return response.Response(UserSerilizer(saved_user).data, status=status.HTTP_200_OK)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ParticipantList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        participants = User.objects.filter(role='participant').values('id', 'username', 'email')
        return response.Response(list(participants), status=status.HTTP_200_OK)


class JudgeList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        judges = User.objects.filter(role='judge').values('id', 'username', 'email')
        return response.Response(list(judges), status=status.HTTP_200_OK)

       
class Token(APIView):
    permission_classes = [permissions.IsAuthenticated]
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
    permission_classes = [permissions.IsAuthenticated]

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





    