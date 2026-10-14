import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import type { AdminUser } from '@/types';
import type { Paginator } from '@/types';

type PageProps = {
    users: Paginator<AdminUser>;
};

export default function UsersIndex() {
    const { users } = usePage<PageProps>().props;
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this user?')) {
            destroy(UserController.destroy.url(id), { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Users" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title="Users"
                    description="Manage who can sign in and which roles they have."
                />

                <Button asChild>
                    <Link href={UserController.create.url()}>
                        <Plus className="h-4 w-4" />
                        New user
                    </Link>
                </Button>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left">
                                <th className="px-4 py-2 font-medium">Name</th>
                                <th className="px-4 py-2 font-medium">Email</th>
                                <th className="px-4 py-2 font-medium">Roles</th>
                                <th className="px-4 py-2 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                                        No users yet.
                                    </td>
                                </tr>
                            )}
                            {users.data.map((user) => (
                                <tr key={user.id} className="border-b last:border-0">
                                    <td className="px-4 py-2 font-medium">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.length === 0 && (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className="rounded-full border bg-muted/50 px-2 py-0.5 text-xs"
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={UserController.edit.url(user.id!)}>
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={processing}
                                                onClick={() => handleDelete(user.id!)}
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

                <Pagination paginator={users} />
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: UserController.index.url(),
        },
    ],
};