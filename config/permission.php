<?php

return [
    'models' => [
        /*
         * When using the "HasPermissions" trait from this package, we need to know which
         * Eloquent model should be used to retrieve your permissions. Of course, it
         * is often just the "Permission" model but you may use whatever you like.
         *
         * The model you want to use as a Permission model needs to implement the
         * `Spatie\Permission\Contracts\Permission` contract.
         */

        'permission' => Spatie\Permission\Models\Permission::class,

        /*
         * When using the "HasRoles" trait from this package, we need to know which
         * Eloquent model should be used to retrieve your roles. Of course, it
         * is often just the "Role" model but you may use whatever you like.
         *
         * The model you want to use as a Role model needs to implement the
         * `Spatie\Permission\Contracts\Role` contract.
         */

        'role' => Spatie\Permission\Models\Role::class,
    ],

    'table_names' => [
        'roles' => 'roles',
        'permissions' => 'permissions',
        'model_has_permissions' => 'model_has_permissions',
        'model_has_roles' => 'model_has_roles',
        'role_has_permissions' => 'role_has_permissions',
    ],

    'column_names' => [
        'model_morph_key' => 'model_id',
    ],

    /*
     * When set to true, the required permission names will be added to the exception
     * message. While convenient, this can be a security risk in production settings,
     * as it could potentially expose sensitive information.
     */
    'display_permission_in_exception' => false,

    /*
     * When set to true, the required role names will be added to the exception
     * message. While convenient, this can be a security risk in production settings,
     * as it could potentially expose sensitive information.
     */
    'display_role_in_exception' => false,

    /*
     * By default all permissions will be loaded from the cache on each request.
     * While convenient, this can be a memory hog,
     * so here you can disable it.
     */
    'cache' => [
        'expiration_time' => \DateInterval::createFromDateString('24 hours'),

        'key' => 'spatie.permission.cache',

        'store' => 'default',
    ],
];

