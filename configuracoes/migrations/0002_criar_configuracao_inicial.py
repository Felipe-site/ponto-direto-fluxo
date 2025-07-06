from django.db import migrations

def criar_configuracao_global(apps, schema_editor):
    ConfiguracaoGlobal = apps.get_model('configuracoes', 'ConfiguracaoGlobal')
    ConfiguracaoGlobal.objects.get_or_create(id=1, defaults={'desconto_combo_ativo': True})

class Migration(migrations.Migration):

    dependencies = [
        ('configuracoes', '0001_initial'), 
    ]

    operations = [
        migrations.RunPython(criar_configuracao_global),
    ]