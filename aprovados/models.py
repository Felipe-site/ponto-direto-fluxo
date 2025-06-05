from django.db import models

class Aprovado(models.Model):
    nome = models.CharField(max_length=100)
    cargo = models.CharField(max_length=100)
    foto = models.ImageField(upload_to="aprovados/")
    ordem = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.nome} - {self.cargo}"