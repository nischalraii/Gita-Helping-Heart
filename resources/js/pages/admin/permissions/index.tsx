import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import PermissionController from '@/actions/App/Http/Controllers/PermissionController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Permission } from '@/types';
import type { Paginator } from '@/types';

type PageProps = {
    permissions: Paginator<Permission>;
};

export default function PermissionsIndex() {
    const { permissions } = usePage<PageProps>().props;
    const { delete: destroy, processing } = useForm();
    const create = useForm({ name: '' });

    const handleDelete = (id: number) => {
        if (confirm('Delete this permission?')) {
            destroy(PermissionController.destroy.url(id), { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Permissions" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title="Permissions"
                    description="Permissions are assigned to roles, which are assigned to users."
                />

                <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            create.post(PermissionController.store.url(), {
                                preserveScroll: true,
                                onSuccess: () => create.reset(),
                            });
                        }}
                        className="max-w-xl space-y-4 rounded-lg border p-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="name">New permission</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="name"
                                    value={create.data.name}
                                    onChange={(event) => create.setData('name', event.target.value)}
                                    placeholder="e.g. manage enquiries"
                                />
                                <Button type="submit" disabled={create.processing || !create.data.name}>
                                    <Plus className="h-4 w-4" />
                                    Add
                                </Button>
                            </div>
                            <InputError className="mt-2" message={create.errors.name} />
                        </div>
                    </form>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left">
                                <th className="px-4 py-2 font-medium">Name</th>
                                <th className="px-4 py-2 font-medium">Used by roles</th>
                                <th className="px-4 py-2 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.data.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                                        No permissions yet.
                                    </td>
                                </tr>
                            )}
                            {permissions.data.map((permission) => (
                                <tr key={permission.id} className="border-b last:border-0">
                                    <td className="px-4 py-2 font-medium">{permission.name}</td>
                                    <td className="px-4 py-2">{permission.roles_count}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={processing}
                                                onClick={() => handleDelete(permission.id!)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={permissions} />
            </div>
        </>
    );
}

PermissionsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Permissions',
            href: PermissionController.index.url(),
        },
    ],
};