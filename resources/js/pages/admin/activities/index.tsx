import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import ActivityController from '@/actions/App/Http/Controllers/ActivityController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/pagination';
import type { ActivityItem } from '@/ngo/data/siteData';
import type { Paginator } from '@/types';

type PageProps = {
    activities: Paginator<ActivityItem>;
};

export default function Activities() {
    const { activities } = usePage<PageProps>().props;
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Delete this activity?')) {
            destroy(ActivityController.destroy.url(id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Activities" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title="Activities"
                    description="Manage the NGO activities shown on the landing page."
                />

                <Button asChild>
                    <Link href={ActivityController.create.url()}>
                        <Plus className="h-4 w-4" />
                        New activity
                    </Link>
                </Button>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left">
                                <th className="px-4 py-2 font-medium">Title</th>
                                <th className="px-4 py-2 font-medium">Tag</th>
                                <th className="px-4 py-2 font-medium">Date</th>
                                <th className="px-4 py-2 font-medium">Location</th>
                                <th className="px-4 py-2 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                                        No activities yet.
                                    </td>
                                </tr>
                            )}
                            {activities.data.map((activity) => (
                                <tr key={activity.id} className="border-b last:border-0">
                                    <td className="px-4 py-2 font-medium">{activity.title}</td>
                                    <td className="px-4 py-2">{activity.tag}</td>
                                    <td className="px-4 py-2">{activity.date}</td>
                                    <td className="px-4 py-2">{activity.location}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={ActivityController.edit.url(activity.id!)}>
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={processing}
                                                onClick={() => handleDelete(activity.id!)}
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

                <Pagination paginator={activities} />
            </div>
        </>
    );
}

Activities.layout = {
    breadcrumbs: [
        {
            title: 'Activities',
            href: ActivityController.index.url(),
        },
    ],
};
