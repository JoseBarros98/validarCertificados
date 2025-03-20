<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rutas públicas
Route::get('/', function () {
    return Inertia::render('Certificates/Index');
})->name('home');

// Ruta para descargar las imágenes de los certificados
Route::get('/certificates/download/{id}', [CertificateController::class, 'download'])
    ->name('certificates.download')
    ->middleware('web'); // Asegurarse de que usa el middleware web

Route::post('/validate-certificate', [CertificateController::class, 'validate'])->name('certificates.validate');
Route::get('/placeholder.svg', [App\Http\Controllers\PlaceholderController::class, 'generatePlaceholder']);

// Rutas para iconos
Route::get('/favicon.png', [App\Http\Controllers\FaviconController::class, 'favicon']);
Route::get('/apple-touch-icon.png', [App\Http\Controllers\FaviconController::class, 'appleTouchIcon']);

// Rutas autenticadas
Route::middleware('auth')->group(function () {
    // Dashboard con datos reales
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rutas de perfil (accesibles para todos los usuarios autenticados)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rutas de administración de usuarios (solo para super-admin)
    Route::prefix('admin/users')->name('admin.users.')->middleware('can:super-admin')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // Rutas de certificados usando resource
    Route::resource('admin/certificates', CertificateController::class)
        ->names([
            'index' => 'admin.certificates.index',
            'create' => 'admin.certificates.create',
            'store' => 'admin.certificates.store',
            'show' => 'admin.certificates.show',
            'edit' => 'admin.certificates.edit',
            'update' => 'admin.certificates.update',
            'destroy' => 'admin.certificates.destroy',
        ]);
    
    // Ruta adicional para toggle-status
    Route::post('admin/certificates/{certificate}/toggle-status', [CertificateController::class, 'toggleStatus'])
        ->name('admin.certificates.toggle-status');
});

require __DIR__.'/auth.php';

