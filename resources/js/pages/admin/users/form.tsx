import { Form, Head, usePage } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdminUser } from '@/types';

type PageProps = {
    user?: AdminUser;
    roles: { id: number; name: string }[];
};

export default function UserForm() {
    const { user, roles } = usePage<PageProps>().props;
    const selectedRoleIds = user?.roles.map((role) => role.id) ?? [];

    return (
        <>
            <Head title={user ? 'Edit user' : 'New user'} />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title={user ? 'Edit user' : 'New user'}
                    description={user ? 'Update the user details and roles.' : 'Create a user and assign roles.'}
                />

                <Form
                    {...(user ? UserController.update.form(user.id!) : UserController.store.form())}
                    options={{ preserveScroll: true }}
                    className="max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={user?.name ?? ''} required autoComplete="name" />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" defaultValue={user?.email ?? ''} required autoComplete="email" />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {user ? 'Password (leave blank to keep current)' : 'Password'}
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required={!user}
                                    autoComplete="new-password"
                                />
                                <InputError className="mt-2" message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    {user ? 'Confirm new password' : 'Confirm password'}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="grid gap-2">
                                <span className="text-sm font-medium">Roles</span>
                                {roles.map((role) => (
                                    <label key={role.id} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            name="roles[]"
                                            value={role.id}
                                            defaultChecked={selectedRoleIds.includes(role.id)}
                                            className="size-4 accent-primary"
                                        />
                                        {role.name}
                                    </label>
                                ))}
                                {roles.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No roles yet. Create one on the Roles screen first.
                                    </p>
                                )}
                                <InputError className="mt-2" message={errors.roles} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {user ? 'Save changes' : 'Create user'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

UserForm.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: UserController.index.url(),
        },
    ],
};