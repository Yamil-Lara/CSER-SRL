<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { -dompdf-table-reset: 1; }
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; background: white; color: #0f172a; }
        .photo { width: 100px; height: 100px; border: 3px solid rgba(255,255,255,0.7); }
        .text-white { color: white; }
        .text-center { text-align: center; }
        .w-full { width: 100%; }
        .p-30 { padding: 30px; }
        .mb-20 { margin-bottom: 20px; }
        .mb-30 { margin-bottom: 30px; }
        .valign-top { vertical-align: top; }
    </style>
</head>
<body style="height: auto !important; overflow: visible !important;">
    <table class="w-full" cellspacing="0" cellpadding="0" style="height: auto !important;">
        <!-- HEADER - KEEP EXACTLY AS IS -->
        <tr>
            <td style="background: #0284c7; padding: 30px; text-align: center;">
                <table class="w-full" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="text-center">
                            @if($data['foto'] && file_exists(storage_path('app/public/' . $data['foto'])))
                                <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(storage_path('app/public/' . $data['foto']))) }}" class="photo" alt="Foto" style="margin-bottom: 15px;">
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center">
                            <h1 class="text-white" style="margin: 0; font-size: 26px; font-weight: bold;">{{ $data['nombre'] }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center text-white" style="font-size: 14px; padding-top: 8px;">
                            {{ $data['profesion'] }}
                        </td>
                    </tr>
                    <tr>
                        <td class="text-center text-white" style="font-size: 11px; padding-top: 6px;">
                            {{ $data['especialidad'] }} | {{ $data['email'] }} | {{ $data['ubicacion'] }}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- CONTENT -->
        <tr>
            <td class="p-30" style="height: auto !important; overflow: visible !important;">
                <!-- 1. EXPERIENCE - FULL WIDTH -->
                @if($data['experiencias'])
                <table class="w-full mb-30" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 15px;">
                            ▸ EXPERIENCIA
                        </td>
                    </tr>
                    <tr>
                        <td>
                            @foreach($data['experiencias'] as $exp)
                            <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
                                <tr>
                                    <td style="font-size: 13px; font-weight: bold; color: #0f172a;">{{ $exp->cargo_titulo }}</td>
                                    <td style="font-size: 12px; color: #475569; text-align: right;">{{ \Carbon\Carbon::parse($exp->fecha_inicio)->format('M Y') }} - {{ $exp->fecha_fin ? \Carbon\Carbon::parse($exp->fecha_fin)->format('M Y') : 'Actual' }}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="font-size: 12px; color: #475569; padding-top: 4px;">
                                        <strong>{{ $exp->institucion_empresa }}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="font-size: 12px; color: #475569; padding-top: 6px; line-height: 1.5;">
                                        {{ $exp->descripcion }}
                                    </td>
                                </tr>
                            </table>
                            @endforeach
                        </td>
                    </tr>
                </table>
                @endif

                <!-- 2. TWO COLUMNS: SKILLS (45%) + PROJECTS (55%) -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; table-layout: fixed; margin-bottom: 30px;">
                    <tr>
                        <!-- LEFT COLUMN (45%) - SKILLS -->
                        <td width="45%" valign="top" style="vertical-align: top; padding-right: 20px;">
                            @if($data['habilidades'])
                            <table class="w-full" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 15px;">
                                        ▸ HABILIDADES
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        @foreach($data['habilidades'] as $skill)
                                        <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 12px;">
                                            <tr>
                                                <td style="font-weight: bold; font-size: 12px; color: #0f172a;">{{ $skill['name'] }}</td>
                                                <td style="text-align: right; font-weight: bold; font-size: 12px; color: #0284c7;">{{ $skill['level'] }}%</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="padding-top: 4px;">
                                                    <div style="width: 100%; height: 5px; background: #e2e8f0;">
                                                        <div style="width: {{ $skill['level'] }}%; height: 5px; background: #0284c7;"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        @endforeach
                                    </td>
                                </tr>
                            </table>
                            @endif
                        </td>

                        <!-- RIGHT COLUMN (55%) - PROJECTS -->
                        <td width="55%" valign="top" style="vertical-align: top;">
                            @if($data['proyectos'])
                            <table class="w-full" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 15px;">
                                        ▸ PROYECTOS
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        @foreach($data['proyectos'] as $project)
                                        <table class="w-full" cellspacing="0" cellpadding="0" style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
                                            <tr>
                                                <td>
                                                    <div style="font-size: 13px; font-weight: bold; color: #0f172a;">{{ $project->titulo }}</div>
                                                    <div style="font-size: 12px; color: #475569; margin-top: 4px; line-height: 1.5;">{{ $project->descripcion }}</div>
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

                <!-- 3. ABOUT ME - FULL WIDTH AT END -->
                @if($data['biografia'])
                <table class="w-full" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 15px;">
                            ▸ SOBRE MÍ
                        </td>
                    </tr>
                    <tr>
                        <td style="font-size: 13px; line-height: 1.6; color: #475569;">
                            {{ $data['biografia'] }}
                        </td>
                    </tr>
                </table>
                @endif
            </td>
        </tr>
    </table>
</body>
</html>
