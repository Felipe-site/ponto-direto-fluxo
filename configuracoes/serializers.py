from rest_framework import serializers
from .models import ConfiguracaoGlobal

class ConfiguracaoGlobalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracaoGlobal
        fields = ['desconto_combo_ativo']