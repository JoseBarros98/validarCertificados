<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    // ... otros middlewares

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
}

