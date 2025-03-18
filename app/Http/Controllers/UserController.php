<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('search');
            
            // Consulta base
            $query = User::query()->with('roles');
            
            // Aplicar filtro de búsqueda si existe
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }
            
            // Obtener usuarios
            $users = $query->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name
                        ];
                    })
                ];
            });
            
            return Inertia::render('Admin/Users/Index', [
                'users' => $users,
                'filters' => [
                    'search' => $search,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error en UserController@index: ' . $e->getMessage());
            // En desarrollo, puedes devolver el error para depuración
            if (config('app.debug')) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ], 500);
            }
            // En producción, devuelve un mensaje genérico
            return back()->with('error', 'Ha ocurrido un error al cargar los usuarios.');
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            // Obtener todos los roles disponibles
            $roles = Role::all()->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name
                ];
            });
            
            return Inertia::render('Admin/Users/Create', [
                'roles' => $roles
            ]);
        } catch (\Exception $e) {
            Log::error('Error en UserController@create: ' . $e->getMessage());
            return back()->with('error', 'Ha ocurrido un error al cargar el formulario de creación.');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validar los datos de entrada
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'role' => 'required|string|exists:roles,name'
            ]);

            // Crear el usuario
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Asignar el rol seleccionado
            $user->assignRole($validated['role']);

            return redirect()->route('admin.users.index')
                ->with('message', 'Usuario creado correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al crear usuario: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error al crear el usuario: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        try {
            // Cargar roles disponibles
            $roles = Role::all()->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name
                ];
            });
            
            // Obtener el rol actual del usuario
            $userRole = $user->roles->first();
            
            return Inertia::render('Admin/Users/Edit', [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ],
                'roles' => $roles,
                'userRole' => $userRole ? $userRole->name : null
            ]);
        } catch (\Exception $e) {
            Log::error('Error en UserController@edit: ' . $e->getMessage());
            return back()->with('error', 'Ha ocurrido un error al cargar el formulario de edición.');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        try {
            // Validar los datos de entrada
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
                'role' => 'required|string|exists:roles,name'
            ]);

            // Actualizar datos básicos
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            // Actualizar contraseña si se proporcionó
            if (!empty($validated['password'])) {
                $user->update([
                    'password' => Hash::make($validated['password']),
                ]);
            }

            // Actualizar rol (eliminar roles anteriores y asignar el nuevo)
            $user->syncRoles([$validated['role']]);

            return redirect()->route('admin.users.index')
                ->with('message', 'Usuario actualizado correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al actualizar usuario: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error al actualizar el usuario: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            // Obtener el ID del usuario autenticado directamente
            $currentUserId = Auth::id();
            
            // Evitar que se elimine a sí mismo
            if ($currentUserId && $user->id === $currentUserId) {
                return redirect()->route('admin.users.index')
                    ->with('error', 'No puedes eliminar tu propio usuario.');
            }

            // Eliminar el usuario
            $user->delete();

            return redirect()->route('admin.users.index')
                ->with('message', 'Usuario eliminado correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al eliminar usuario: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error al eliminar el usuario: ' . $e->getMessage());
        }
    }
}

