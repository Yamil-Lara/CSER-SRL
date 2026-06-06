<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mpdf\Mpdf;

class CVController extends Controller
{
    public function downloadCV(Request $request)
    {
        $request->validate([
            'template' => 'required|in:moderna,clasica,minimalista,creativa'
        ]);

        $user = auth()->user();
        $template = $request->template;

        $user->load('experiencias', 'skills', 'proyectos');

        $userData = [
            'nombre' => $user->nombre,
            'profesion' => $user->profesion,
            'especialidad' => $user->especialidad,
            'biografia' => $user->biografia,
            'ubicacion' => $user->ubicacion,
            'email' => $user->email,
            'foto' => $user->foto,
            'universidad' => $user->universidad,
            'carrera' => $user->carrera,
            'experiencias' => $user->experiencias,
            'habilidades' => $user->skills,
            'proyectos' => $user->proyectos,
        ];

        $html = view("cv.templates.{$template}", ['data' => $userData])->render();

        $mpdf = new Mpdf([
            'margin_left' => 0,
            'margin_right' => 0,
            'margin_top' => 0,
            'margin_bottom' => 0,
            'format' => [210, 2000],
        ]);
        $mpdf->WriteHTML($html);

        // Ajustar alto al contenido real
        $height = $mpdf->y + 10;
        $mpdf = new Mpdf([
            'margin_left' => 0,
            'margin_right' => 0,
            'margin_top' => 0,
            'margin_bottom' => 0,
            'format' => [210, $height],
        ]);
        $mpdf->WriteHTML($html);

        return response($mpdf->Output('', 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"cv_{$user->nombre}.pdf\"",
        ]);
    }

    public function previewCV(Request $request)
    {
        $request->validate([
            'template' => 'required|in:moderna,clasica,minimalista,creativa'
        ]);

        $user = auth()->user();
        $template = $request->template;

        // Cargar relaciones
        $user->load('experiencias', 'skills', 'proyectos');

        $userData = [
            'nombre' => $user->nombre,
            'profesion' => $user->profesion,
            'especialidad' => $user->especialidad,
            'biografia' => $user->biografia,
            'ubicacion' => $user->ubicacion,
            'email' => $user->email,
            'foto' => $user->foto,
            'universidad' => $user->universidad,
            'carrera' => $user->carrera,
            'experiencias' => $user->experiencias,
            'habilidades' => $user->skills,
            'proyectos' => $user->proyectos,
        ];

        $view = "cv.templates.{$template}";

        return view($view, ['data' => $userData]);
    }
}
