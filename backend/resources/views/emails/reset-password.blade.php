<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Recuperación de contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    {{-- Header --}}
                    <tr>
                        <td style="background-color: #1e40af; padding: 24px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">CSER S.R.L.</h1>
                        </td>
                    </tr>

                    {{-- Contenido --}}
                    <tr>
                        <td style="padding: 32px;">
                            <h2 style="color: #1f2937; margin-top: 0;">Hola, {{ $userName }}</h2>

                            <p style="color: #4b5563; line-height: 1.6;">
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta en CSER S.R.L.
                            </p>

                            <p style="color: #4b5563; line-height: 1.6;">
                                Haz clic en el siguiente botón para crear una nueva contraseña:
                            </p>

                            <div style="text-align: center; margin: 32px 0;">
                                <a href="{{ $resetUrl }}"
                                   style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    Restablecer mi contraseña
                                </a>
                            </div>

                            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                            </p>
                            <p style="color: #1e40af; font-size: 13px; word-break: break-all;">
                                {{ $resetUrl }}
                            </p>

                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

                            <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
                                <strong>Este enlace expira en 60 minutos.</strong>
                            </p>
                            <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
                                Si no solicitaste el cambio de contraseña, ignora este mensaje. Tu contraseña actual seguirá siendo válida.
                            </p>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                © {{ date('Y') }} CSER S.R.L. — Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
