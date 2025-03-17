<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Registrar los permisos como Gates
        $this->registerPermissions();
    }
    
    protected function registerPermissions(): void
    {
        Gate::before(function (User $user, $ability) {
            if ($user->hasRole('super-admin')) {
                return true;
            }
        });
    }
}

