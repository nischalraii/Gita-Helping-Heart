<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class UserRolePermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    private function superAdmin(): User
    {
        foreach (['manage activities', 'manage enquiries', 'manage site settings', 'manage focus areas'] as $permission) {
            Permission::findOrCreate($permission);
        }

        $user = User::factory()->create();
        $user->assignRole(Role::findOrCreate('Super Admin')->syncPermissions(Permission::all()));

        return $user;
    }

    private function validUserPayload(array $roles = []): array
    {
        return [
            'name' => 'Jane Doe',
            'email' => 'jane@example.org',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'roles' => $roles,
        ];
    }

    public function test_guests_are_redirected_from_admin_screens(): void
    {
        $this->get('/admin/users')->assertRedirect('/login');
        $this->get('/admin/roles')->assertRedirect('/login');
        $this->get('/admin/permissions')->assertRedirect('/login');
        $this->get('/admin/activities')->assertRedirect('/login');
        $this->get('/admin/focus-areas')->assertRedirect('/login');
        $this->get('/enquiries')->assertRedirect('/login');
        $this->get('/site-settings')->assertRedirect('/login');
    }

    public function test_regular_users_cannot_access_admin_screens(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/admin/users')->assertForbidden();
        $this->actingAs($user)->get('/admin/roles')->assertForbidden();
        $this->actingAs($user)->get('/admin/permissions')->assertForbidden();
        $this->actingAs($user)->get('/admin/activities')->assertForbidden();
        $this->actingAs($user)->get('/admin/focus-areas')->assertForbidden();
        $this->actingAs($user)->get('/enquiries')->assertForbidden();
        $this->actingAs($user)->get('/site-settings')->assertForbidden();
    }

    public function test_admin_role_does_not_grant_administration_access(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(Role::findOrCreate('Admin'));

        $this->actingAs($admin)->get('/admin/users')->assertForbidden();
        $this->actingAs($admin)->get('/admin/roles')->assertForbidden();
        $this->actingAs($admin)->get('/admin/permissions')->assertForbidden();
    }

    public function test_manage_activities_permission_gates_activities_page_only(): void
    {
        $user = $this->userWithPermission('manage activities');

        $this->actingAs($user)->get('/admin/activities')->assertOk();
        $this->actingAs($user)->get('/enquiries')->assertForbidden();
        $this->actingAs($user)->get('/site-settings')->assertForbidden();
    }

    public function test_manage_enquiries_permission_gates_enquiries_page_only(): void
    {
        $user = $this->userWithPermission('manage enquiries');

        $this->actingAs($user)->get('/enquiries')->assertOk();
        $this->actingAs($user)->get('/admin/activities')->assertForbidden();
        $this->actingAs($user)->get('/site-settings')->assertForbidden();
    }

    public function test_manage_site_settings_permission_gates_site_settings_page_only(): void
    {
        $user = $this->userWithPermission('manage site settings');

        $this->actingAs($user)->get('/site-settings')->assertOk();
        $this->actingAs($user)->get('/admin/activities')->assertForbidden();
        $this->actingAs($user)->get('/enquiries')->assertForbidden();
    }

    public function test_super_admin_can_access_all_admin_screens(): void
    {
        $user = $this->superAdmin();

        $this->actingAs($user)->get('/admin/users')->assertOk();
        $this->actingAs($user)->get('/admin/roles')->assertOk();
        $this->actingAs($user)->get('/admin/permissions')->assertOk();
        $this->actingAs($user)->get('/admin/activities')->assertOk();
        $this->actingAs($user)->get('/admin/focus-areas')->assertOk();
        $this->actingAs($user)->get('/enquiries')->assertOk();
        $this->actingAs($user)->get('/site-settings')->assertOk();
    }

    public function test_super_admin_can_create_roles(): void
    {
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->post('/admin/roles', ['name' => 'Editor'])
            ->assertRedirect('/admin/roles');

        $this->assertDatabaseHas('roles', ['name' => 'Editor']);
    }

    public function test_roles_can_be_created_with_permissions(): void
    {
        $user = $this->superAdmin();
        $manageEnquiries = Permission::findOrCreate('manage enquiries');

        $this->actingAs($user)
            ->post('/admin/roles', [
                'name' => 'Editor',
                'permissions' => [$manageEnquiries->id],
            ])
            ->assertRedirect('/admin/roles');

        $this->assertDatabaseHas('roles', ['name' => 'Editor']);
        $this->assertTrue(Role::findByName('Editor')->hasPermissionTo('manage enquiries'));
    }

    public function test_role_permissions_can_be_updated_with_form_string_ids(): void
    {
        $user = $this->superAdmin();
        $role = Role::create(['name' => 'Editor']);
        $manageEnquiries = Permission::findOrCreate('manage enquiries');

        // Browser form fields submit values as strings; this is the regression
        // that previously caused "There is no permission named `1` for guard `web`".
        $this->actingAs($user)
            ->put("/admin/roles/{$role->id}", [
                'name' => 'Editor',
                'permissions' => [(string) $manageEnquiries->id],
            ])
            ->assertRedirect('/admin/roles');

        $this->assertTrue($role->fresh()->hasPermissionTo('manage enquiries'));
    }

    public function test_user_roles_can_be_updated_with_form_string_ids(): void
    {
        $user = $this->superAdmin();
        $target = User::factory()->create();
        $role = Role::create(['name' => 'Editor']);

        $this->actingAs($user)
            ->put("/admin/users/{$target->id}", [
                'name' => $target->name,
                'email' => $target->email,
                'roles' => [(string) $role->id],
            ])
            ->assertRedirect('/admin/users');

        $this->assertTrue($target->fresh()->hasRole('Editor'));
    }

    public function test_super_admin_can_create_permissions(): void
    {
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->from('/admin/permissions')
            ->post('/admin/permissions', ['name' => 'manage reports'])
            ->assertRedirect('/admin/permissions');

        $this->assertDatabaseHas('permissions', ['name' => 'manage reports']);
    }

    public function test_users_can_be_created_with_roles(): void
    {
        $user = $this->superAdmin();
        $role = Role::create(['name' => 'Editor']);

        $this->actingAs($user)
            ->post('/admin/users', $this->validUserPayload([$role->id]))
            ->assertRedirect('/admin/users');

        $created = User::where('email', 'jane@example.org')->first();
        $this->assertNotNull($created);
        $this->assertTrue($created->hasRole('Editor'));
    }

    public function test_super_admin_cannot_delete_own_account(): void
    {
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->from('/admin/users')
            ->delete("/admin/users/{$user->id}")
            ->assertRedirect('/admin/users');

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    public function test_super_admin_cannot_remove_own_super_admin_role(): void
    {
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->from("/admin/users/{$user->id}/edit")
            ->put("/admin/users/{$user->id}", [
                'name' => $user->name,
                'email' => $user->email,
                'roles' => [],
            ])
            ->assertSessionHasErrors('roles');

        $this->assertTrue($user->fresh()->hasRole('Super Admin'));
    }
}
