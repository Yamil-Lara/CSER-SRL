<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*', 'login', 'register', 'logout'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => ['*'],  // Permitir todas las IPs
    
    'allowed_origins_patterns' => [],  // Déjalo vacío
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,  // Cambiar a true
];