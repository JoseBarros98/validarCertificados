<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rutas públicas
Route::get('/', function () {
    return Inertia::render('Certificates/Index');
})->name('home');

Route::post('/validate-certificate', [CertificateController::class, 'validate'])->name('certificates.validate');
Route::get('/placeholder.svg', [App\Http\Controllers\PlaceholderController::class, 'generatePlaceholder']);

// Rutas autenticadas
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

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

    // Rutas de certificados
    Route::prefix('admin/certificates')->name('admin.certificates.')->group(function () {
        // Listado de certificados
        Route::get('/', [CertificateController::class, 'index'])->name('index');
        
        // IMPORTANTE: Definir la ruta de creación ANTES de las rutas con parámetros
        Route::get('/create', [CertificateController::class, 'create'])->name('create');
        Route::post('/', [CertificateController::class, 'store'])->name('store');
        
        // Rutas con parámetros
        Route::get('/{certificate}/edit', [CertificateController::class, 'edit'])->name('edit');
        Route::put('/{certificate}', [CertificateController::class, 'update'])->name('update');
        Route::post('/{certificate}/toggle-status', [CertificateController::class, 'toggleStatus'])->name('toggle-status');
        
        // IMPORTANTE: Esta ruta debe ir AL FINAL para evitar conflictos
        Route::get('/{certificate}', [CertificateController::class, 'show'])->name('show');
    });
});

require __DIR__.'/auth.php';

