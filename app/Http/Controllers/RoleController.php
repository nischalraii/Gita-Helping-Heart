<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * List all roles for the admin screen.
     */
    public function index(): Response
    {
        return Inertia::render('admin/roles/index', [
            'roles' => Role::withCount('users')->orderBy('name')->paginate(10),
        ]);
    }

    /**
     * Show the form to create a role.
     */
    public function create(): Response
    {
        return Inertia::render('admin/roles/form', [
            'permissions' => Permission::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role = Role::create(['name' => $data['name']]);

        $role->syncPermissions(array_map('intval', $data['permissions'] ?? []));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role created.']);

        return to_route('admin.roles.index');
    }

    /**
     * Show the form to edit a role.
     */
    public function edit(Role $role): Response
    {
        return Inertia::render('admin/roles/form', [
            'role' => $role->load('permissions'),
            'permissions' => Permission::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update an existing role.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,'.$role->id],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        $role->update(['name' => $data['name']]);

        $role->syncPermissions(array_map('intval', $data['permissions'] ?? []));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role updated.']);

        return to_route('admin.roles.index');
    }

    /**
     * Remove a role.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if ($role->users()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Role is assigned to users and cannot be deleted.']);

            return back();
        }

        $role->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Role deleted.']);

        return back();
    }
}
