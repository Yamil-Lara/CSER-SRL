<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    if (!file_exists($filePath)) {
        abort(404);
    }
    
    // Auto-detect MIME type for proper image rendering
    $mimeType = mime_content_type($filePath) ?: 'application/octet-stream';
    return response()->file($filePath, ['Content-Type' => $mimeType]);
})->where('path', '.*');

Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');
