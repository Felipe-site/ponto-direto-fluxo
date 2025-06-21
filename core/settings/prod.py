import os
print("--- INICIANDO O CARREGAMENTO DE PROD.PY (MODO DEBUG) ---")

try:
    # Tentamos importar tudo do base.py. É aqui que o erro real está acontecendo.
    from .base import *
    print("--- SUCESSO: base.py FOI IMPORTADO SEM ERROS ---")

except Exception as e:
    # Se qualquer erro acontecer durante a importação do base.py, vamos capturá-lo.
    print("!!!!!!!! ERRO CRÍTICO AO IMPORTAR BASE.PY !!!!!!!!")
    import traceback
    traceback.print_exc() # Imprime o traceback completo do erro real.
    raise e

# Se o base.py foi importado com sucesso, o código continua...
DEBUG = False

# Usamos config() aqui também para ler as variáveis de ambiente
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = f'Direto no Ponto <{EMAIL_HOST_USER}>'

DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,
        ssl_require=True
    )
}

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

print(f"--- DEBUG PROD: DEBUG={DEBUG} ---")
print(f"--- DEBUG PROD: ALLOWED_HOSTS={ALLOWED_HOSTS} ---")
print("--- FIM DO CARREGAMENTO DE PROD.PY ---")