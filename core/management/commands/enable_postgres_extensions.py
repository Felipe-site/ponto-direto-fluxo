from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Habilita as extensões necessárias do PostgreSQL (unaccent e pg_trgm).'

    def handle(self, *args, **options):
        self.stdout.write('Tentando habilitar as extensões do PostgreSQL...')
        
        try:
            with connection.cursor() as cursor:
                # Comando para habilitar a busca sem acentos
                self.stdout.write('Habilitando unaccent...')
                cursor.execute("CREATE EXTENSION IF NOT EXISTS unaccent;")
                
                # Comando para habilitar a busca por similaridade (fuzzy search)
                self.stdout.write('Habilitando pg_trgm...')
                cursor.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")

            self.stdout.write(self.style.SUCCESS('Extensões unaccent e pg_trgm habilitadas com sucesso ou já existentes.'))
        
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Ocorreu um erro ao habilitar as extensões: {e}'))
            self.stderr.write('Isso pode ser normal se o usuário do banco de dados não tiver privilégios de superusuário. Muitas vezes, estas extensões já estão disponíveis por padrão em plataformas como o Render.')