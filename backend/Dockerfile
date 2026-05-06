FROM php:8.2-apache

# Instalar extensiones de PHP y utilidades
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libpq-dev \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip gd

# Habilitar mod_rewrite para Laravel
RUN a2enmod rewrite

# Cambiar el DocumentRoot a la carpeta public de Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar archivos del proyecto
WORKDIR /var/www/html
COPY . .

# Instalar dependencias de PHP
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Dar permisos a las carpetas storage y bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configurar puerto para Render
ENV PORT 80
EXPOSE 80

# Script de inicio
RUN chmod +x /var/www/html/start.sh
CMD ["/var/www/html/start.sh"]
