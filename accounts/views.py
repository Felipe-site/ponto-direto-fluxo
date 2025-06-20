from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserProfileSerializer, AreaInteresseSerializer
from .models import AreaInteresse

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class AreaInteresseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AreaInteresse.objects.all()
    serializer_class = AreaInteresseSerializer
    permission_classes = [IsAuthenticated]
