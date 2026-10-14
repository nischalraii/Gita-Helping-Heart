import { Form, Head, usePage } from '@inertiajs/react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Permission } from '@/types';

type PageProps = {
    role?: { id: number; name: string; permissions: Permission[] };
    permissions: Permission[];
};

export default function RoleForm() {
    const { role, permissions } = usePage<PageProps>().props;
    const selectedPermissionIds = role?.permissions.map((permission) => permission.id) ?? [];

    return (
        <>
            <Head title={role ? 'Edit role' : 'New role'} />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title={role ? 'Edit role' : 'New role'}
                    description={role ? 'Update the role and its permissions.' : 'Create a role and choose its permissions.'}
                />

                <Form
                    {...(role ? RoleController.update.form(role.id!) : RoleController.store.form())}
                    options={{ preserveScroll: true }}
                    className="max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={role?.name ?? ''} required placeholder="e.g. Editor" />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <span className="text-sm font-medium">Permissions</span>
                                {permissions.map((permission) => (
                                    <label key={permission.id} className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            name="permissions[]"
                                            value={permission.id}
                                            defaultChecked={selectedPermissionIds.includes(permission.id)}
                                            className="size-4 accent-primary"
                                        />
                                        {permission.name}
                                    </label>
                                ))}
                                {permissions.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        No permissions yet. Create one on the Permissions screen first.
                                    </p>
                                )}
                                <InputError className="mt-2" message={errors.permissions} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {role ? 'Save changes' : 'Create role'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

RoleForm.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
            href: RoleController.index.url(),
        },
    ],
};