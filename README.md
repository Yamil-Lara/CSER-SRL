# CSER-SRL - Proyecto TIS

Estructura oficial con **Laravel 10** y **React 17**.

## Requisitos
* PHP >= 8.1 (XAMPP recomendado)
* Composer
* Node.js & npm

## Configuración del Backend
1. Entrar a la carpeta: `cd backend`
2. Instalar dependencias: `composer install`
3. Copiar el archivo de entorno: `cp .env.example .env`
4. Generar la clave de la app: `php artisan key:generate`
DB_DATABASE=cser_srl  <-- Asegurarse de que este nombre sea exacto
5. Configurar la DB en el `.env` y correr: `php artisan migrate`
6. Iniciar servidor: `php artisan serve`

## Configuración del Frontend
1. Entrar a la carpeta: `cd frontend`
2. Instalar dependencias: `npm install --legacy-peer-deps`
3. Iniciar servidor: `npm run dev`