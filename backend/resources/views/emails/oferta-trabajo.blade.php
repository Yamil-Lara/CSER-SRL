<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nueva Oferta de Trabajo</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background-color: #2563eb; color: #ffffff; padding: 15px; border-radius: 8px 8px 0 0; text-align: center; }
        h1 { margin: 0; font-size: 24px; }
        .content { margin-top: 20px; color: #333333; line-height: 1.6; }
        .details { background-color: #f9fafb; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; border-radius: 4px; }
        .details p { margin: 5px 0; }
        .footer { margin-top: 30px; font-size: 12px; color: #777777; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Tienes una nueva oferta de trabajo!</h1>
        </div>
        
        <div class="content">
            <p>Hola,</p>
            <p>El reclutador <strong>{{ $oferta->nombre }}</strong> de la empresa <strong>{{ $oferta->empresa }}</strong> ha visto tu perfil y quiere ofrecerte una oportunidad.</p>
            
            <div class="details">
                <p><strong>Puesto:</strong> {{ $oferta->titulo_puesto }}</p>
                <p><strong>Modalidad:</strong> {{ $oferta->modalidad }}</p>
                <p><strong>Contrato:</strong> {{ $oferta->tipo_contrato }}</p>
                @if($oferta->salario)
                <p><strong>Salario Ofrecido:</strong> {{ $oferta->salario }}</p>
                @endif
                <p><strong>Ubicación:</strong> {{ $oferta->ciudad }}, {{ $oferta->pais }}</p>
                <p><strong>Tecnologías Buscadas:</strong> {{ $oferta->tecnologias }}</p>
                <p><strong>Email de Contacto:</strong> <a href="mailto:{{ $oferta->email_contacto }}">{{ $oferta->email_contacto }}</a></p>
            </div>
            
            <h3>Mensaje del Reclutador:</h3>
            <p style="white-space: pre-wrap; font-style: italic;">"{{ $oferta->mensaje }}"</p>
            
            <p>Puedes responder directamente a este correo para comunicarte con el reclutador a través del email de contacto proporcionado.</p>
        </div>
        
        <div class="footer">
            <p>Plataforma de Portafolios Digitales &copy; {{ date('Y') }}</p>
            <p>Este es un correo automático. Por favor no respondas directamente a esta dirección a menos que quieras contactar con soporte.</p>
        </div>
    </div>
</body>
</html>
