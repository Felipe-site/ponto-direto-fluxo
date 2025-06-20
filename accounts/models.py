from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify

class AreaInteresse(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nome)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = 'Área de Interesse'
        verbose_name_plural = 'Áreas de Interesse'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    signup_method = models.CharField(
        max_length=20, 
        choices=[('site', 'Site'), ('google', 'Google')],
        null=True,
        blank=True
    )

    telefone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Número de Telefone")
    formacao = models.CharField(max_length=100, blank=True, null=True,  verbose_name="Formação Acadêmica")
    concurso_desejado = models.CharField(max_length=200, blank=True, null=True, verbose_name="Concurso Desejado")
    aprovacoes = models.TextField(blank=True, null=True, verbose_name="Aprovações Anteriores")
    bio = models.TextField(blank=True, null=True, verbose_name="Sobre Mim")
    areas_interesse = models.ManyToManyField(AreaInteresse, blank=True, related_name='perfis')

    def __str__(self):
        return f'Perfil de {self.user.username}'
'''
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()
'''