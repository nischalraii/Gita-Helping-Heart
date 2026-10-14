<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Fortify\Features;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

abstract class TestCase extends BaseTestCase
{
    protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }

    /**
     * Create a user granted the given permission.
     */
    protected function userWithPermission(string $permission): User
    {
        Permission::findOrCreate($permission);
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return User::factory()->create()->givePermissionTo($permission);
    }
}
