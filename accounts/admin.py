from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile, AreaInteresse

@admin.register(AreaInteresse)
class AreaInteresseAdmin(admin.ModelAdmin):
    list_display = ('nome', 'slug')
    prepopulated_fields = {'slug': ('nome',)}

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Perfil do Usuário'
    fields = ('signup_method', 'telefone', 
              'formacao', 'concurso_desejado', 
              'aprovacoes', 'bio', 'areas_interesse')
    readonly_fields = ('signup_method',)
    filter_horizontal = ('areas_interesse',)

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_signup_method', 'get_interesses')
    list_select_related = ('profile',)

    @admin.display(description='Método de Cadastro')
    def get_signup_method(self, instance):
        return instance.profile.get_signup_method_display()
    
    @admin.display(description='Áreas de Interesse')
    def get_interesses(self, instance):
        return ", ".join([area.nome for area in instance.profile.areas_interesse.all()])

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

