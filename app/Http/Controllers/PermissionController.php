<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    /**
     * List all permissions for the admin screen.
     */
    public function index(): Response
    {
        return Inertia::render('admin/permissions/index', [
            'permissions' => Permission::withCount('roles')->orderBy('name')->paginate(10),
        ]);
    }

    /**
     * Store a newly created permission.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions,name'],
        ]);

        Permission::create(['name' => $data['name']]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Permission created.']);

        return back();
    }

    /**
     * Remove a permission.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        if ($permission->roles()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Permission is assigned to roles and cannot be deleted.']);

            return back();
        }

        $permission->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Permission deleted.']);

        return back();
    }
}
