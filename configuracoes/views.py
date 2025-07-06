from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import ConfiguracaoGlobal
from .serializers import ConfiguracaoGlobalSerializer

class ConfiguracaoGlobalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ConfiguracaoGlobal.objects.all().order_by('id')[:1]
    serializer_class = ConfiguracaoGlobalSerializer
    permission_classes = [permissions.AllowAny] 