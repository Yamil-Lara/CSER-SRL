<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function show()
    {
        $profile = Profile::first();

        if (! $profile) {
            return response()->json([
                'name' => '',
                'email' => '',
                'profession' => '',
                'specialty' => '',
                'biography' => '',
                'skills' => '',
                'experience' => '',
                'location' => '',
                'phone' => '',
                'linkedin' => '',
                'github' => '',
                'website' => '',
                'university' => '',
                'career' => '',
                'education' => '',
                'image_url' => null,
            ]);
        }

        return response()->json($profile);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'profession' => ['required', 'string', 'max:255'],
            'specialty' => ['required', 'string', 'max:255'],
            'biography' => ['nullable', 'string'],
            'skills' => ['nullable', 'string'],
            'experience' => ['nullable', 'string'],
            'location' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'linkedin' => ['nullable', 'url', 'max:255'],
            'github' => ['nullable', 'url', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'university' => ['nullable', 'string', 'max:255'],
            'career' => ['nullable', 'string', 'max:255'],
            'education' => ['nullable', 'string'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        $profile = Profile::first();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $filename = Str::uuid() . '.' . $image->extension();
            $path = $image->storeAs('profile_images', $filename, 'public');

            if ($profile && $profile->image_path) {
                Storage::disk('public')->delete($profile->image_path);
            }

            $validated['image_path'] = $path;
        }

        if ($profile) {
            $profile->update($validated);
        } else {
            $profile = Profile::create($validated);
        }

        return response()->json($profile);
    }
}
