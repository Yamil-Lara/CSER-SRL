<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>¡Cuenta Aprobada!</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #10b981; color: #ffffff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }
        h1 { margin: 0; font-size: 24px; }
        .content { margin-top: 20px; color: #333333; line-height: 1.6; text-align: center; }
        .btn { display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { margin-top: 30px; font-size: 12px; color: #777777; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Felicidades!</h1>
        </div>
        <div class="content">
            <p>¡Hola {{ $user->nombre }}!</p>
            <p>Tu cuenta ha sido verificada y aprobada por nuestro equipo. Ya puedes iniciar sesión en DevFolio y comenzar a crear tu portafolio profesional.</p>
            <p>¡Bienvenido a bordo!</p>
            <a href="{{ env('FRONTEND_URL', 'http://localhost:5173') }}/login" class="btn" style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold;">Iniciar Sesión</a>
        </div>
        <div class="footer">
            <p>DevFolio &copy; {{ date('Y') }}</p>
            <p>Este es un correo automático. Por favor no respondas a esta dirección.</p>
        </div>
    </div>
</body>
</html>
