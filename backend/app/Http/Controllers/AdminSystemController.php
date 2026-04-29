<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

class AdminSystemController extends Controller
{
    // === FUNCIONALIDAD DE BACKUPS ===

    public function indexBackups()
    {
        // Asegúrate de que la carpeta existe
        if (!Storage::exists('backups')) {
            Storage::makeDirectory('backups');
        }

        $files = Storage::files('backups');
        $backups = [];

        foreach ($files as $file) {
            $backups[] = [
                'name' => basename($file),
                'size' => round(Storage::size($file) / 1024 / 1024, 2) . ' MB',
                'date' => date('d/m/Y H:i:s', Storage::lastModified($file)),
            ];
        }

        return response()->json(['success' => true, 'data' => $backups]);
    }

    public function createBackup()
    {
        // En un entorno real, aquí ejecutarías: \Artisan::call('backup:run');
        // Para este ejemplo, simularemos la creación de un volcado SQL
        $filename = 'backup_' . date('Ymd_His') . '.sql';
        Storage::put('backups/' . $filename, "-- CSER-SRL Database Dump\n-- Date: " . date('Y-m-d H:i:s'));

        return response()->json(['success' => true, 'message' => 'Backup generado exitosamente']);
    }

    public function downloadBackup($filename)
    {
        if (Storage::exists('backups/' . $filename)) {
            return Storage::download('backups/' . $filename);
        }
        return response()->json(['success' => false, 'message' => 'Archivo no encontrado'], 404);
    }

    public function deleteBackup($filename)
    {
        if (Storage::exists('backups/' . $filename)) {
            Storage::delete('backups/' . $filename);
            return response()->json(['success' => true, 'message' => 'Backup eliminado']);
        }
        return response()->json(['success' => false, 'message' => 'Error al eliminar'], 404);
    }

    // === FUNCIONALIDAD DE LOGS ===

    public function getLogs()
    {
        $logPath = storage_path('logs/laravel.log');
        
        if (!File::exists($logPath)) {
            return response()->json(['success' => true, 'data' => []]);
        }

        $content = File::get($logPath);
        // Dividimos el log por las fechas [YYYY-MM-DD...]
        $pattern = "/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]/";
        $entries = preg_split($pattern, $content, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);
        preg_match_all($pattern, $content, $dates);

        $logs = [];
        if (isset($dates[0])) {
            foreach ($dates[0] as $index => $date) {
                if (isset($entries[$index])) {
                    $rawEntry = $entries[$index];
                    // Detectar nivel de log
                    $level = 'INFO';
                    if (str_contains($rawEntry, '.ERROR:')) $level = 'ERROR';
                    if (str_contains($rawEntry, '.WARNING:')) $level = 'WARNING';
                    if (str_contains($rawEntry, '.DEBUG:')) $level = 'DEBUG';

                    $logs[] = [
                        'date' => trim($date, '[]'),
                        'level' => $level,
                        'message' => substr(trim(str_replace('local.' . $level . ':', '', $rawEntry)), 0, 500)
                    ];
                }
            }
        }

        return response()->json(['success' => true, 'data' => array_reverse($logs)]);
    }
}