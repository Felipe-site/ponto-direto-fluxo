#!/usr/bin/env bash

set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

echo "Habilitando extensões do PostgreSQL..." 
python manage.py enable_postgres_extensions

python manage.py createsuperuser --noinput || true