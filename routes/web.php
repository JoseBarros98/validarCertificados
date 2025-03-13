<?php

use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminCertificateController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rutas públicas
Route::get('/', [CertificateController::class, 'index'])->name('home');
Route::post('/validate-certificate', [CertificateController::class, 'validate'])->name('validate.certificate');

// Rutas protegidas (requieren autenticación)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Rutas para gestión de certificados
    Route::get('/admin/certificates', [AdminCertificateController::class, 'index'])->name('admin.certificates.index');
    Route::get('/admin/certificates/create', [AdminCertificateController::class, 'create'])->name('admin.certificates.create');
    Route::post('/admin/certificates', [AdminCertificateController::class, 'store'])->name('admin.certificates.store');
    Route::get('/admin/certificates/{certificate}/edit', [AdminCertificateController::class, 'edit'])->name('admin.certificates.edit');
    Route::put('/admin/certificates/{certificate}', [AdminCertificateController::class, 'update'])->name('admin.certificates.update');
    Route::delete('/admin/certificates/{certificate}', [AdminCertificateController::class, 'destroy'])->name('admin.certificates.destroy');
    // En routes/web.php
Route::post('/admin/certificates/{certificate}/toggle-status', [AdminCertificateController::class, 'toggleStatus'])
->name('admin.certificates.toggle-status')
->middleware(['auth']);

Route::get('/placeholder.svg', [App\Http\Controllers\PlaceholderController::class, 'generatePlaceholder']);
});

// Rutas de perfil existentes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';