<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class AdminSystemController extends Controller
{
    // ==========================================
    // FUNCIONALIDAD DE BACKUPS (SQL COMPLETO)
    // ==========================================

    public function indexBackups()
    {
        // Asegurarse de que la carpeta existe
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

        // Ordenar los backups del más reciente al más antiguo basado en el nombre (que contiene la fecha)
        usort($backups, function ($a, $b) {
            return strcmp($b['name'], $a['name']);
        });

        return response()->json(['success' => true, 'data' => $backups]);
    }

    public function createBackup()
    {
        try {
            if (!Storage::exists('backups')) {
                Storage::makeDirectory('backups');
            }

            $filename = 'backup_completo_' . date('Ymd_His') . '.sql';
            
            // Usamos la conexión base de PDO para mayor seguridad al escapar strings
            $pdo = DB::connection()->getPdo();
            
            // Encabezado del archivo SQL
            $sql = "-- ====================================================\n";
            $sql .= "-- Respaldo Completo de Base de Datos - CSER-SRL\n";
            $sql .= "-- Fecha de generación: " . date('Y-m-d H:i:s') . "\n";
            $sql .= "-- ====================================================\n\n";
            
            // Desactivar revisión de llaves foráneas para evitar errores al importar
            $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

            // 1. Obtener los nombres de todas las tablas en la base de datos
            $tables = DB::select('SHOW TABLES');

            foreach ($tables as $table) {
                // Extraemos el nombre de la tabla dinámicamente
                $tableName = array_values((array)$table)[0];

                // 2. Extraer la ESTRUCTURA (CREATE TABLE)
                $sql .= "-- --------------------------------------------------------\n";
                $sql .= "-- Estructura de la tabla `$tableName`\n";
                $sql .= "-- --------------------------------------------------------\n";
                $sql .= "DROP TABLE IF EXISTS `$tableName`;\n";
                
                $createTable = DB::select("SHOW CREATE TABLE `$tableName`");
                $sql .= array_values((array)$createTable[0])[1] . ";\n\n";

                // 3. Extraer los DATOS (INSERT INTO)
                $sql .= "-- Volcado de datos para la tabla `$tableName`\n";
                $rows = DB::table($tableName)->get();
                
                if ($rows->count() > 0) {
                    foreach ($rows as $row) {
                        $rowArray = (array)$row;
                        
                        // Escapar valores correctamente (previene inyecciones SQL y errores de comillas)
                        $values = array_map(function ($value) use ($pdo) {
                            if (is_null($value)) return 'NULL';
                            return $pdo->quote($value); 
                        }, $rowArray);
                        
                        $sql .= "INSERT INTO `$tableName` VALUES (" . implode(", ", $values) . ");\n";
                    }
                } else {
                    $sql .= "-- (La tabla está vacía)\n";
                }
                $sql .= "\n\n";
            }

            // Reactivar llaves foráneas
            $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

            // Guardar el script SQL final en el almacenamiento
            Storage::put('backups/' . $filename, $sql);

            return response()->json([
                'success' => true, 
                'message' => 'Backup SQL generado exitosamente con estructura y datos.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'Error al generar el backup: ' . $e->getMessage()
            ], 500);
        }
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

    // ==========================================
    // FUNCIONALIDAD DE LOGS (REGISTRO DE ACTIVIDAD)
    // ==========================================

    public function getLogs()
    {
        $logPath = storage_path('logs/laravel.log');
        
        if (!File::exists($logPath)) {
            return response()->json(['success' => true, 'data' => []]);
        }

        // 2. Leemos solo las últimas 1000 líneas para no colapsar la memoria si el archivo es gigante
        $lines = array_slice(file($logPath), -1000);
        $content = implode("", $lines);

        // 3. Expresión regular CON paréntesis para atrapar exactamente las fechas y dividir el texto
        $pattern = "/(\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\])/";
        $parts = preg_split($pattern, $content, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE);

        $logs = [];
        $currentDate = null;

        foreach ($parts as $part) {
            // Si el fragmento es una fecha, la guardamos temporalmente
            if (preg_match($pattern, $part)) {
                $currentDate = trim($part, '[]');
            } 
            // Si el fragmento es el texto del error (y ya atrapamos una fecha antes)
            elseif ($currentDate) {
                $level = 'INFO';
                if (str_contains($part, '.ERROR:')) $level = 'ERROR';
                elseif (str_contains($part, '.WARNING:')) $level = 'WARNING';
                elseif (str_contains($part, '.DEBUG:')) $level = 'DEBUG';

                // Limpiamos la palabra "local.ERROR:" del inicio del mensaje
                $message = preg_replace('/^[\s\w]+\.(ERROR|INFO|WARNING|DEBUG):/', '', $part);
                $message = trim($message);

                if (!empty($message)) {
                    $logs[] = [
                        'date' => $currentDate,
                        'level' => $level,
                        // Enviamos el mensaje completo sin recortarlo
                        'message' => $message 
                    ];
                }
                
                // Reseteamos la fecha para el siguiente ciclo
                $currentDate = null;
            }
        }

        // Devolvemos el array invertido (los más recientes primero)
        return response()->json(['success' => true, 'data' => array_reverse($logs)]);
    }
}