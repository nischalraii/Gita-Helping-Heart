import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { KeyRound, Pencil, Plus, Trash2 } from 'lucide-react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import type { AdminRole } from '@/types';
import type { Paginator } from '@/types';

type PageProps = {
    roles: Paginator<AdminRole>;
};

export default function RolesIndex() {
    const { roles } = usePage<PageProps>().props;
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this role?')) {
            destroy(RoleController.destroy.url(id), { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Roles" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title="Roles"
                    description="Create and assign roles."
                />

                <Button asChild>
                    <Link href={RoleController.create.url()}>
                        <Plus className="h-4 w-4" />
                        New role
                    </Link>
                </Button>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left">
                                <th className="px-4 py-2 font-medium">Name</th>
                                <th className="px-4 py-2 font-medium">Users</th>
                                <th className="px-4 py-2 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.data.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                                        No roles yet.
                                    </td>
                                </tr>
                            )}
                            {roles.data.map((role) => (
                                <tr key={role.id} className="border-b last:border-0">
                                    <td className="px-4 py-2 font-medium">
                                        <span className="inline-flex items-center gap-2">
                                            <KeyRound className="h-4 w-4 text-muted-foreground" />
                                            {role.name}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{role.users_count}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={RoleController.edit.url(role.id!)}>
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={processing}
                                                onClick={() => handleDelete(role.id!)}
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

                <Pagination paginator={roles} />
            </div>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Roles',
            href: RoleController.index.url(),
        },
    ],
};