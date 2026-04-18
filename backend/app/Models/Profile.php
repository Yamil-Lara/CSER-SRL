<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name',
        'email',
        'profession',
        'specialty',
        'biography',
        'skills',
        'experience',
        'location',
        'phone',
        'linkedin',
        'github',
        'facebook',
        'instagram',
        'twitter',
        'tiktok',
        'threads',
        'website',
        'university',
        'career',
        'education',
        'image_path',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }
}
