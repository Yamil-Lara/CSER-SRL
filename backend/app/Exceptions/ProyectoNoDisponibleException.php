<?php

namespace App\Exceptions;

use RuntimeException;

class ProyectoNoDisponibleException extends RuntimeException
{
    public function __construct(string $message = 'Proyecto no encontrado o no disponible')
    {
        parent::__construct($message);
    }
}
