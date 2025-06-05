from django.shortcuts import render
from rest_framework import viewsets
from .models import Aprovado
from api.serializers import AprovadoSerializer
from rest_framework.permissions import AllowAny

class AprovadoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Aprovado.objects.all().order_by("ordem")
    serializer_class = AprovadoSerializer
    permission_classes = [AllowAny]
