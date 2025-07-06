from django.contrib import admin
from .models import Aprovado

@admin.register(Aprovado)
class AprovadoAdmin(admin.ModelAdmin):
    list_display = ("nome", "cargo", "ordem", "link_externo")
    list_editable = ("ordem",)
    ordering = ("ordem",)

    class Media:
        js = ["aprovados/js/admin_extra_button.js"]