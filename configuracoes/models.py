from django.db import models

class ConfiguracaoGlobal(models.Model):
    id = models.IntegerField(primary_key=True, default=1, editable=False)
    desconto_combo_ativo = models.BooleanField(default=True, verbose_name="Ativar Desconto Automático por Combo?")

    def __str__(self):
        return "Configurações Gerais do Site"

    class Meta:
        verbose_name = "Configuração Geral"
        verbose_name_plural = "Configurações Gerais"