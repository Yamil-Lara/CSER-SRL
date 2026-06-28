<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Actualización de Cuenta</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #ef4444; color: #ffffff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }
        h1 { margin: 0; font-size: 24px; }
        .content { margin-top: 20px; color: #333333; line-height: 1.6; text-align: center; }
        .footer { margin-top: 30px; font-size: 12px; color: #777777; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Actualización sobre tu cuenta</h1>
        </div>
        <div class="content">
            <p>Hola {{ $user->nombre }}.</p>
            <p>Lamentamos informarte que tu solicitud de cuenta no pudo ser aprobada en esta ocasión. Para mantener la calidad de la plataforma, requerimos datos reales, coherentes y profesionales.</p>
            <p>Te invitamos a registrarte nuevamente usando información válida. ¡Te esperamos con los brazos abiertos!</p>
        </div>
        <div class="footer">
            <p>DevFolio &copy; {{ date('Y') }}</p>
            <p>Este es un correo automático. Por favor no respondas a esta dirección.</p>
        </div>
    </div>
</body>
</html>
