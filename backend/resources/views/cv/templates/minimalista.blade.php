<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { -dompdf-table-reset: 1; }
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background: white; color: #111111; }
        .photo { width: 60px; height: 60px; border: none; }
        .section-title { font-size: 12px; font-weight: bold; color: #111111; margin: 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #888888; padding-bottom: 6px; }
        .bio-text { font-size: 11px; line-height: 1.6; color: #333333; }
        .skill-name { font-weight: normal; color: #111111; font-size: 11px; }
        .timeline-role { font-size: 12px; font-weight: bold; color: #111111; }
        .timeline-date { font-size: 10px; color: #888888; }
        .timeline-company { font-size: 11px; color: #888888; font-weight: normal; }
        .timeline-desc { font-size: 10px; color: #333333; line-height: 1.5; }
        .project-title { font-size: 12px; font-weight: bold; color: #111111; }
        .project-desc { font-size: 10px; color: #333333; line-height: 1.4; }
        .text-center { text-align: center; }
        .w-full { width: 100%; }
        .p-30 { padding: 30px; }
        .mb-20 { margin-bottom: 20px; }
        .mb-25 { margin-bottom: 25px; }
        .valign-top { vertical-align: top; }
    </style>
</head>
<body style="height: auto !important; overflow: visible !important;">
    <table class="w-full" cellspacing="0" cellpadding="0" style="height: auto !important;">
        <!-- HEADER: NAME + PHOTO -->
        <tr>
            <td class="p-30" style="border-bottom: 1px solid #888888;">
                <table class="w-full" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="vertical-align: top;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #111111; line-height: 1.2;">{{ $data['nombre'] }}</h1>
                            <div style="font-size: 12px; color: #888888; margin-top: 8px;">{{ $data['profesion'] }}</div>
                            <div style="font-size: 10px; color: #888888; margin-top: 6px;">{{ $data['email'] }} | {{ $data['ubicacion'] }}</div>
                        </td>
                        <td style="padding-left: 20px; vertical-align: top; text-align: right;">
                            @if($data['foto'] && file_exists(storage_path('app/public/' . $data['foto'])))
                                <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(storage_path('app/public/' . $data['foto']))) }}" class="photo" alt="Foto">
                            @endif
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- CONTENT -->
        <tr>
            <td class="p-30" style="height: auto !important; overflow: visible !important;">
                @if($data['biografia'])
                <table class="w-full mb-25" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="section-title">Sobre mí</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 10px;">
                            <div class="bio-text">{{ $data['biografia'] }}</div>
                        </td>
                    </tr>
                </table>
                @endif

                @if($data['experiencias'])
                <table class="w-full mb-25" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="section-title">Experiencia</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 12px;">
                            @foreach($data['experiencias'] as $exp)
                            <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                                <tr>
                                    <td class="timeline-role">{{ $exp->cargo_titulo }}</td>
                                    <td class="timeline-date" style="text-align: right;">{{ \Carbon\Carbon::parse($exp->fecha_inicio)->format('M Y') }} - {{ $exp->fecha_fin ? \Carbon\Carbon::parse($exp->fecha_fin)->format('M Y') : 'Actual' }}</td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div class="timeline-company" style="margin-top: 2px;">{{ $exp->institucion_empresa }}</div>
                                        <div class="timeline-desc" style="margin-top: 3px;">{{ $exp->descripcion }}</div>
                                    </td>
                                </tr>
                            </table>
                            @endforeach
                        </td>
                    </tr>
                </table>
                @endif

                @if($data['proyectos'])
                <table class="w-full mb-25" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="section-title">Proyectos</td>
                    </tr>
                    <tr>
                        <td style="padding-top: 12px;">
                            @foreach($data['proyectos'] as $project)
                            <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
                                <tr>
                                    <td>
                                        <div class="project-title">{{ $project->titulo }}</div>
                                        <div class="project-desc" style="margin-top: 2px;">{{ $project->descripcion }}</div>
                                    </td>
                                </tr>
                            </table>
                            @endforeach
                        </td>
                    </tr>
                </table>
                @endif

                @if($data['habilidades'])
                <table class="w-full" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="section-title" colspan="2">Habilidades</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-top: 12px;">
                            <table width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="50%" valign="top" style="vertical-align: top; padding-right: 15px;">
                                        @foreach($data['habilidades'] as $skill)
                                            @if($loop->index % 2 == 0)
                                            <div class="skill-name" style="margin-bottom: 6px;">{{ $skill['name'] }} — {{ $skill['level'] }}%</div>
                                            @endif
                                        @endforeach
                                    </td>
                                    <td width="50%" valign="top" style="vertical-align: top;">
                                        @foreach($data['habilidades'] as $skill)
                                            @if($loop->index % 2 == 1)
                                            <div class="skill-name" style="margin-bottom: 6px;">{{ $skill['name'] }} — {{ $skill['level'] }}%</div>
                                            @endif
                                        @endforeach
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                @endif
            </td>
        </tr>
    </table>
</body>
</html>
