from django.db import models

class Aprovado(models.Model):
    nome = models.CharField(max_length=100)
    cargo = models.CharField(max_length=100)
    foto = models.ImageField(upload_to="aprovados/")
    ordem = models.PositiveIntegerField(default=0)
    link_externo = models.URLField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="Link Externo (Opcional)",
        help_text="Link do Instagram, LinkedIn ou outra página do aprovado."
    )

    def __str__(self):
        return f"{self.nome} - {self.cargo}"