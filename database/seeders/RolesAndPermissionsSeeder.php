<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Desactivar temporalmente las restricciones de clave foránea
        Schema::disableForeignKeyConstraints();

        // Limpiar tablas relacionadas con permisos y roles
        DB::table('model_has_permissions')->truncate();
        DB::table('model_has_roles')->truncate();
        DB::table('role_has_permissions')->truncate();
        Permission::truncate();
        Role::truncate();

        // Reactivar restricciones de clave foránea
        Schema::enableForeignKeyConstraints();

        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear permisos
        // Permisos para usuarios
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);
        Permission::create(['name' => 'view users']);

        // Permisos para certificados
        Permission::create(['name' => 'create certificates']);
        Permission::create(['name' => 'edit certificates']);
        Permission::create(['name' => 'delete certificates']);
        Permission::create(['name' => 'view certificates']);
        Permission::create(['name' => 'toggle certificate status']);

        // Crear roles y asignar permisos
        // Rol de Super Admin (tiene todos los permisos)
        $role1 = Role::create(['name' => 'super-admin']);
        $role1->givePermissionTo(Permission::all());

        // Rol de Gestor de Certificados
        $role2 = Role::create(['name' => 'certificate-manager']);
        $role2->givePermissionTo([
            'create certificates',
            'edit certificates',
            'view certificates',
            'toggle certificate status'
        ]);

        // Rol de Visualizador de Certificados
        $role3 = Role::create(['name' => 'certificate-viewer']);
        $role3->givePermissionTo([
            'view certificates'
        ]);

        // Crear un usuario admin por defecto si no existe
        $admin = User::where('email', 'admin@example.com')->first();
        if (!$admin) {
            $admin = User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
            ]);
        }
        $admin->syncRoles(['super-admin']);

        // Crear un usuario gestor por defecto si no existe
        $manager = User::where('email', 'gestor@example.com')->first();
        if (!$manager) {
            $manager = User::create([
                'name' => 'Gestor',
                'email' => 'gestor@example.com',
                'password' => Hash::make('password'),
            ]);
        }
        $manager->syncRoles(['certificate-manager']);

        // Crear un usuario visualizador por defecto si no existe
        $viewer = User::where('email', 'visualizador@example.com')->first();
        if (!$viewer) {
            $viewer = User::create([
                'name' => 'Visualizador',
                'email' => 'visualizador@example.com',
                'password' => Hash::make('password'),
            ]);
        }
        $viewer->syncRoles(['certificate-viewer']);
    }
}

