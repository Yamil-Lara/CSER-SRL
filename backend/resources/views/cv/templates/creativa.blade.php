<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { -dompdf-table-reset: 1; }
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background: white; color: #1e293b; }
        .photo { width: 80px; height: 80px; border: 3px solid #10b981; }
        .sidebar-title { font-size: 12px; font-weight: bold; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; margin-top: 15px; }
        .sidebar-text { font-size: 11px; color: white; line-height: 1.5; margin-bottom: 8px; }
        .skill-name { font-weight: normal; color: white; font-size: 11px; margin-bottom: 6px; }
        .skill-bar { background: #334155; height: 4px; margin-top: 2px; }
        .skill-fill { background: #10b981; height: 100%; }
        .content-title { font-size: 13px; font-weight: bold; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-bottom: 12px; }
        .bio-text { font-size: 11px; line-height: 1.6; color: #475569; }
        .exp-role { font-size: 12px; font-weight: bold; color: #1e293b; }
        .exp-date { font-size: 10px; color: #64748b; }
        .exp-company { font-size: 11px; color: #10b981; font-weight: bold; margin-top: 2px; }
        .exp-desc { font-size: 10px; color: #475569; line-height: 1.5; margin-top: 3px; }
        .project-title { font-size: 11px; font-weight: bold; color: #1e293b; }
        .project-desc { font-size: 10px; color: #475569; line-height: 1.4; margin-top: 2px; }
        .w-full { width: 100%; }
        .p-20 { padding: 20px; }
        .mb-15 { margin-bottom: 15px; }
        .mb-20 { margin-bottom: 20px; }
        .valign-top { vertical-align: top; }
    </style>
</head>
<body style="height: auto !important; overflow: visible !important;">
    <table class="w-full" cellspacing="0" cellpadding="0" style="height: auto !important;">
        <tr>
            <!-- SIDEBAR (35%) -->
            <td width="35%" valign="top" style="vertical-align: top; background: #1e293b; padding: 30px 20px; color: white;">
                <!-- Photo -->
                <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                    <tr>
                        <td style="text-align: center;">
                            @if($data['foto'] && file_exists(storage_path('app/public/' . $data['foto'])))
                                <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(storage_path('app/public/' . $data['foto']))) }}" class="photo" alt="Foto">
                            @endif
                        </td>
                    </tr>
                </table>

                <!-- Name & Profession -->
                <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; text-align: center;">
                    <tr>
                        <td style="font-size: 18px; font-weight: bold; color: white; margin-bottom: 4px;">{{ $data['nombre'] }}</td>
                    </tr>
                    <tr>
                        <td style="font-size: 12px; color: #cbd5e1;">{{ $data['profesion'] }}</td>
                    </tr>
                </table>

                <!-- Contact -->
                <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                    <tr>
                        <td class="sidebar-title">Contacto</td>
                    </tr>
                    <tr>
                        <td class="sidebar-text">{{ $data['email'] }}</td>
                    </tr>
                    <tr>
                        <td class="sidebar-text">{{ $data['ubicacion'] }}</td>
                    </tr>
                </table>

                <!-- Skills -->
                @if($data['habilidades'])
                <table class="w-full" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="sidebar-title">Habilidades</td>
                    </tr>
                    <tr>
                        <td>
                            @foreach($data['habilidades'] as $skill)
                            <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
                                <tr>
                                    <td class="skill-name">{{ $skill['name'] }} — {{ $skill['level'] }}%</td>
                                </tr>
                                <tr>
                                    <td class="skill-bar">
                                        <div class="skill-fill" style="width: {{ $skill['level'] }}%;"></div>
                                    </td>
                                </tr>
                            </table>
                            @endforeach
                        </td>
                    </tr>
                </table>
                @endif

                <!-- Education -->
                @if($data['universidad'])
                <table class="w-full" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                    <tr>
                        <td class="sidebar-title">Educación</td>
                    </tr>
                    <tr>
                        <td class="sidebar-text" style="font-weight: bold;">{{ $data['carrera'] }}</td>
                    </tr>
                    <tr>
                        <td class="sidebar-text">{{ $data['universidad'] }}</td>
                    </tr>
                </table>
                @endif
            </td>

            <!-- CONTENT (65%) -->
            <td width="65%" valign="top" style="vertical-align: top; background: white; padding: 30px 25px;">
                <!-- About -->
                @if($data['biografia'])
                <table class="w-full mb-20" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="content-title">Sobre mí</td>
                    </tr>
                    <tr>
                        <td class="bio-text">{{ $data['biografia'] }}</td>
                    </tr>
                </table>
                @endif

                <!-- Experience -->
                @if($data['experiencias'])
                <table class="w-full mb-20" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="content-title">Experiencia</td>
                    </tr>
                    <tr>
                        <td>
                            @foreach($data['experiencias'] as $exp)
                            <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 15px;">
                                <tr>
                                    <td class="exp-role">{{ $exp->cargo_titulo }}</td>
                                    <td class="exp-date" style="text-align: right;">{{ \Carbon\Carbon::parse($exp->fecha_inicio)->format('M Y') }} - {{ $exp->fecha_fin ? \Carbon\Carbon::parse($exp->fecha_fin)->format('M Y') : 'Actual' }}</td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div class="exp-company">{{ $exp->institucion_empresa }}</div>
                                        <div class="exp-desc">{{ $exp->descripcion }}</div>
                                    </td>
                                </tr>
                            </table>
                            @endforeach
                        </td>
                    </tr>
                </table>
                @endif

                <!-- Projects -->
                @if($data['proyectos'])
                <table class="w-full" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="content-title">Proyectos</td>
                    </tr>
                    <tr>
                        <td>
                            @foreach($data['proyectos'] as $project)
                            <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
                                <tr>
                                    <td>
                                        <div class="project-title">{{ $project->titulo }}</div>
                                        <div class="project-desc">{{ $project->descripcion }}</div>
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
</body>
</html>
