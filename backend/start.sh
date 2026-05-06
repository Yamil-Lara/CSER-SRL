#!/bin/bash

# Configurar el puerto de Apache basado en la variable de entorno PORT (requerido por Render)
sed -i "s/Listen 80/Listen ${PORT:-80}/g" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT:-80}/g" /etc/apache2/sites-available/000-default.conf

# Ejecutar migraciones automáticamente
echo "Running database migrations..."
php artisan migrate --force

# Iniciar Apache en primer plano
echo "Starting Apache..."
apache2-foreground
