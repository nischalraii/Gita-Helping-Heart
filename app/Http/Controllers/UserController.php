<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * List all users for the admin screen.
     */
    public function index(): Response
    {
        $users = User::with('roles')->orderBy('name')->paginate(10);

        return Inertia::render('admin/users/index', ['users' => $users]);
    }

    /**
     * Show the form to create a user.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/form', [
            'roles' => Role::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['integer', 'exists:roles,id'],
        ]);

        $user = User::create(['name' => $data['name'], 'email' => $data['email'], 'password' => $data['password']]);

        $user->syncRoles(array_map('intval', $data['roles'] ?? []));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User created.']);

        return to_route('admin.users.index');
    }

    /**
     * Show the form to edit a user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/form', [
            'user' => $user->load('roles'),
            'roles' => Role::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['integer', 'exists:roles,id'],
        ]);

        if ($user->is(auth()->user()) && ! $this->keepsSuperAdmin($user, $data['roles'] ?? [])) {
            return back()->withErrors(['roles' => 'You cannot remove your own Super Admin role.']);
        }

        $user->update(array_filter($data, fn ($value) => $value !== null));

        $user->syncRoles(array_map('intval', $data['roles'] ?? []));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User updated.']);

        return to_route('admin.users.index');
    }

    /**
     * Remove a user.
     */
    public function destroy(User $user): RedirectResponse
    {
        if ($user->is(auth()->user())) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'You cannot delete your own account.']);

            return back();
        }

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'User deleted.']);

        return back();
    }

    /**
     * Determine whether the given roles keep the user as a Super Admin.
     */
    private function keepsSuperAdmin(User $user, array $roleIds): bool
    {
        return $user->hasRole('Super Admin')
            && Role::whereIn('id', $roleIds)->pluck('name')->contains('Super Admin');
    }
}
