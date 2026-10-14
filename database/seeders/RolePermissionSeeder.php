<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Seed the default role and the per-page management permissions.
     */
    public function run(): void
    {
        // The permission cache persists in the database store; drop it so findOrCreate sees fresh rows.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (['manage activities', 'manage enquiries', 'manage site settings', 'manage focus areas'] as $permission) {
            Permission::findOrCreate($permission);
        }

        // Retire the permission tiers from earlier seeds; administration is role-based now.
        $obsolete = Permission::whereIn('name', [
            'manage users', 'manage roles', 'manage permissions',
            'view users', 'create users', 'edit users', 'delete users',
            'view roles', 'create roles', 'edit roles', 'delete roles',
            'view permissions', 'create permissions', 'edit permissions', 'delete permissions',
        ])->get();

        if ($obsolete->isNotEmpty()) {
            foreach (Role::all() as $role) {
                $role->revokePermissionTo($obsolete);
            }

            Permission::whereIn('id', $obsolete->pluck('id'))->delete();
        }

        Role::findOrCreate('Super Admin')->syncPermissions(Permission::all());

        // Admins manage content only; user/role/permission routes stay Super Admin-only.
        Role::findOrCreate('Admin')->syncPermissions([
            'manage activities',
            'manage enquiries',
            'manage site settings',
            'manage focus areas',
        ]);

        User::where('email', 'sadmin@admin.com')->first()?->assignRole('Super Admin');
    }
}
