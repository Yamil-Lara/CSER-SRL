<?php

// Script para crear el enlace simbólico del storage en hostings compartidos donde no hay terminal (SSH).

$targetFolder = __DIR__ . '/../storage/app/public';
$linkFolder = __DIR__ . '/storage';

echo "Intentando crear enlace simbólico...<br><br>";
echo "Ruta de origen (Target): " . $targetFolder . "<br>";
echo "Ruta destino (Link): " . $linkFolder . "<br><br>";

if (file_exists($linkFolder)) {
    echo "El directorio/enlace 'storage' ya existe. Intentando eliminarlo...<br>";
    if (is_link($linkFolder)) {
        unlink($linkFolder);
        echo "Enlace anterior eliminado.<br><br>";
    } else {
        echo "<b>ERROR:</b> Existe una carpeta real llamada 'storage' en public. Debes eliminarla manualmente por FTP antes de ejecutar este script.<br>";
        exit;
    }
}

try {
    if (symlink($targetFolder, $linkFolder)) {
        echo "<b style='color:green'>¡ÉXITO!</b> El enlace simbólico fue creado correctamente.<br>";
        echo "Tus imágenes de /storage/ ahora deberían ser accesibles públicamente.";
    } else {
        echo "<b style='color:red'>ERROR:</b> La función symlink() falló. Puede que el servidor de la universidad tenga bloqueada esta función por seguridad.<br>";
    }
} catch (Exception $e) {
    echo "<b style='color:red'>EXCEPCIÓN:</b> " . $e->getMessage();
}
