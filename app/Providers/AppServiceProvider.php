<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
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
        
        // Registrar los roles como Gates
        Gate::define('super-admin', function (User $user) {
            return $user->hasRole('super-admin');
        });
        
        Gate::define('certificate-manager', function (User $user) {
            return $user->hasRole('certificate-manager');
        });
        
        Gate::define('certificate-viewer', function (User $user) {
            return $user->hasRole('certificate-viewer');
        });
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

