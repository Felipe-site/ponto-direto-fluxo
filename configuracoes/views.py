from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import ConfiguracaoGlobal
from .serializers import ConfiguracaoGlobalSerializer

class ConfiguracaoGlobalViewSet(viewsets.ReadOnlyModelViewSet):
    # Garante que, se não houver configuração, cria uma. E sempre retorna a única que existe.
    queryset = ConfiguracaoGlobal.objects.all()
    serializer_class = ConfiguracaoGlobalSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        obj, created = ConfiguracaoGlobal.objects.get_or_create(id=1)
        return [obj]