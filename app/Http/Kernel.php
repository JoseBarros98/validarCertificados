<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    // 
    protected $middleware = [
        // \App\Http\Middleware\TrustHosts::class,
        
        \Illuminate\Http\Middleware\HandleCors::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \App\Http\Middleware\FrameGuard::class, // Añadir el middleware personalizado
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array<string, class-string|string>
     */
    protected $routeMiddleware = [
        // ... otros middlewares
        'permission' => \App\Http\Middleware\EnsureUserHasPermission::class,
        'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
        'permission.spatie' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
        'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class
    ];

    protected $commands = [
        // ...
        \App\Console\Commands\ProcessCertificateImages::class,
      \App\Console\Commands\EnsureFontsDirectory::class,
    ];
}

