<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view projects',
            'create projects',
            'edit projects',
            'delete projects',

            'view tasks',
            'create tasks',
            'edit tasks',
            'delete tasks',

            'create comments',
            'delete comments',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission
            ]);
        }

        $admin = Role::firstOrCreate([
            'name' => 'admin'
        ]);

        $member = Role::firstOrCreate([
            'name' => 'member'
        ]);

        $admin->givePermissionTo(Permission::all());

        $member->givePermissionTo([
            'view projects',
            'view tasks',
            'edit tasks',
            'create comments',
        ]);
    }
}