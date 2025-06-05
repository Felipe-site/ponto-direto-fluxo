from django.contrib import admin
from .models import Aprovado

@admin.register(Aprovado)
class AprovadoAdmin(admin.ModelAdmin):
    list_display = ("nome", "cargo", "ordem")
    ordering = ("ordem",)
