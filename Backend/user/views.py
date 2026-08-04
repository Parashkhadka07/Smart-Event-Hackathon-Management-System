from django.shortcuts import render
from django.http import JsonResponse
from .models import User
# Create your views here.
def users(request,id):
    student=User.objects.all()
    print("======",student,"=========")

    data = [
        {
            "id": obj.id,
            "display_name": obj.username.upper(),
            "is_active": obj.is_active,
            "email": obj.email,
              "role":obj.role, 
        } for obj in student]
    for item in data:
        
        if str(item.get("id"))==id:
            data1=item
                
    
    try:
        return JsonResponse(data1,safe=False) 
    except:
        return JsonResponse({"404 error":"not found"})