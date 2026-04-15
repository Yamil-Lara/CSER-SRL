<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    public const ROLES_PERMITIDOS = ['usuario', 'admin', 'moderador'];
    public const ESTADOS_PERMITIDOS = ['pendiente', 'aprobado', 'rechazado'];

    protected $fillable = [
        'nombre',
        'username',
        'email',
        'password',
        'foto',
        'rol',
        'activo',
        'estado',
        'profesion',
        'especialidad',
        'biografia',
        'ubicacion',
        'linkedin',
        'github_perfil',
        'sitio_web',
        'universidad',
        'carrera',
        'nivel_estudios',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function isAdmin(): bool
    {
        return $this->rol === 'admin';
    }

    public function isModerador(): bool
    {
        return $this->rol === 'moderador';
    }

    public function estaAprobado(): bool
    {
        return $this->estado === 'aprobado';
    }

    public function proyectos(): HasMany
    {
        return $this->hasMany(Proyecto::class, 'usuario_id');
    }

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class, 'usuario_id');
    }
 
    public function experiencias(): HasMany
    {
        return $this->hasMany(Experience::class, 'usuario_id');
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(Comentario::class, 'usuario_id');
    }

    public function scopeActivos(Builder $query): Builder
    {
        return $query->where('activo', true);
    }

    public function scopeAprobados(Builder $query): Builder
    {
        return $query->where('estado', 'aprobado');
    }
}