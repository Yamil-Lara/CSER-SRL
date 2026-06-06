<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { -dompdf-table-reset: 1; }
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background: white; color: #1a1a1a; }
        .photo { width: 100px; height: 100px; border: 3px solid #b8960c; }
        .section-title { background: #b8960c; color: white; padding: 10px 12px; font-size: 13px; font-weight: bold; text-transform: uppercase; margin: 0; }
        .bio-text { font-size: 12px; line-height: 1.6; color: #333; }
        .skill-name { font-weight: bold; color: #1a1a1a; font-size: 12px; }
        .skill-percent { font-weight: bold; color: #b8960c; font-size: 12px; }
        .timeline-role { font-size: 13px; font-weight: bold; color: #1a1a1a; }
        .timeline-date { font-size: 11px; color: #666; }
        .timeline-company { font-size: 12px; color: #b8960c; font-weight: bold; }
        .timeline-desc { font-size: 11px; color: #555; line-height: 1.5; }
        .project-title { font-size: 12px; font-weight: bold; color: #1a1a1a; }
        .project-desc { font-size: 11px; color: #555; line-height: 1.4; }
        .text-center { text-align: center; }
        .w-full { width: 100%; }
        .p-20 { padding: 20px; }
        .p-30 { padding: 30px; }
        .mb-15 { margin-bottom: 15px; }
        .mb-20 { margin-bottom: 20px; }
        .valign-top { vertical-align: top; }
    </style>
</head>
<body style="height: auto !important; overflow: visible !important;">
    <table class="w-full" cellspacing="0" cellpadding="0" style="height: auto !important;">
        <!-- HEADER -->
        <tr>
            <td class="p-30 text-center">
                <table class="w-full" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="text-center">
                            <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #1a1a1a;">{{ $data['nombre'] }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center" style="padding-top: 15px;">
                            @if($data['foto'] && file_exists(storage_path('app/public/' . $data['foto'])))
                                <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(storage_path('app/public/' . $data['foto']))) }}" class="photo" alt="Foto" style="margin-bottom: 15px;">
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center" style="font-size: 13px; color: #1a1a1a; font-weight: bold; padding-top: 10px;">
                            {{ $data['profesion'] }}
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center" style="font-size: 11px; color: #666; padding-top: 8px;">
                            {{ $data['email'] }} | {{ $data['ubicacion'] }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- DIVIDER -->
        <tr>
            <td style="border-bottom: 2px solid #b8960c; height: 1px;"></td>
        </tr>

        <!-- TWO COLUMN CONTENT -->
        <tr>
            <td style="padding: 30px; vertical-align: top;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; table-layout: fixed;">
                    <tr>
                        <!-- LEFT COLUMN (40%) -->
                        <td width="40%" valign="top" style="vertical-align: top; padding-right: 20px;">
                            @if($data['biografia'])
                            <table class="w-full mb-20" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="section-title">Sobre mí</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <div class="bio-text">{{ $data['biografia'] }}</div>
                                    </td>
                                </tr>
                            </table>
                            @endif

                            @if($data['habilidades'])
                            <table class="w-full mb-20" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="section-title">Habilidades</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        @foreach($data['habilidades'] as $skill)
                                        <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
                                            <tr>
                                                <td class="skill-name">{{ $skill['name'] }}</td>
                                                <td class="skill-percent" style="text-align: right;">{{ $skill['level'] }}%</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-top: 4px;">
                                                    <div style="width: 100%; height: 4px; background: #e0e0e0;">
                                                        <div style="width: {{ $skill['level'] }}%; height: 4px; background: #b8960c;"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        @endforeach
                                    </td>
                                </tr>
                            </table>
                            @endif

                            @if($data['universidad'])
                            <table class="w-full" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="section-title">Educación</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <div class="timeline-role">{{ $data['carrera'] }}</div>
                                        <div class="timeline-company" style="margin-top: 3px;">{{ $data['universidad'] }}</div>
                                    </td>
                                </tr>
                            </table>
                            @endif
                        </td>

                        <!-- RIGHT COLUMN (60%) -->
                        <td width="60%" valign="top" style="vertical-align: top;">
                            @if($data['experiencias'])
                            <table class="w-full mb-20" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="section-title">Experiencia</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        @foreach($data['experiencias'] as $exp)
                                        <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 15px;">
                                            <tr>
                                                <td class="timeline-role">{{ $exp->cargo_titulo }}</td>
                                                <td class="timeline-date" style="text-align: right;">{{ \Carbon\Carbon::parse($exp->fecha_inicio)->format('Y') }} - {{ $exp->fecha_fin ? \Carbon\Carbon::parse($exp->fecha_fin)->format('Y') : 'Actual' }}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2">
                                                    <div class="timeline-company" style="margin-top: 2px;">{{ $exp->institucion_empresa }}</div>
                                                    <div class="timeline-desc" style="margin-top: 4px;">{{ $exp->descripcion }}</div>
                                                </td>
                                            </tr>
                                        </table>
                                        @endforeach
                                    </td>
                                </tr>
                            </table>
                            @endif

                            @if($data['proyectos'])
                            <table class="w-full" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="section-title">Proyectos</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        @foreach($data['proyectos'] as $project)
                                        <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e0e0e0;">
                                            <tr>
                                                <td>
                                                    <div class="project-title">{{ $project->titulo }}</div>
                                                    <div class="project-desc" style="margin-top: 3px;">{{ $project->descripcion }}</div>
                                                </td>
                                            </tr>
                                        </table>
                                        @endforeach
                                    </td>
                                </tr>
                            </table>
                            @endif
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
