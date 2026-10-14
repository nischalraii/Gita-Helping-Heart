import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import FocusAreaController from '@/actions/App/Http/Controllers/FocusAreaController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import type { FocusAreaItem } from '@/ngo/data/siteData';

type PageProps = {
    focusAreas: FocusAreaItem[];
};

export default function FocusAreas() {
    const { focusAreas } = usePage<PageProps>().props;
    const [items, setItems] = useState(focusAreas);
    const { delete: destroy, processing } = useForm();

    // Re-sync once the server returns the persisted order.
    useEffect(() => setItems(focusAreas), [focusAreas]);

    const move = (index: number, direction: -1 | 1) => {
        const target = index + direction;

        if (target < 0 || target >= items.length) {
            return;
        }

        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        setItems(next);

        // ponytail: rapid clicks can fire overlapping requests; the server keeps
        // the last one. Debounce or lock the buttons if reordering gets heavy.
        router.patch(
            FocusAreaController.reorder.url(),
            { ids: next.map((focusArea) => focusArea.id) },
            { preserveScroll: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this focus area?')) {
            destroy(FocusAreaController.destroy.url(id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Focus Areas" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title="Focus Areas"
                    description="Manage the “Where We Focus” cards shown on the landing page. Use the arrows to set their order."
                />

                <Button asChild>
                    <Link href={FocusAreaController.create.url()}>
                        <Plus className="h-4 w-4" />
                        New focus area
                    </Link>
                </Button>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left">
                                <th className="px-4 py-2 font-medium">Title</th>
                                <th className="px-4 py-2 font-medium">Icon</th>
                                <th className="px-4 py-2 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                                        No focus areas yet.
                                    </td>
                                </tr>
                            )}
                            {items.map((focusArea, index) => (
                                <tr key={focusArea.id} className="border-b last:border-0">
                                    <td className="px-4 py-2 font-medium">{focusArea.title}</td>
                                    <td className="px-4 py-2">{focusArea.icon}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={index === 0}
                                                aria-label="Move up"
                                                onClick={() => move(index, -1)}
                                            >
                                                <ChevronUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={index === items.length - 1}
                                                aria-label="Move down"
                                                onClick={() => move(index, 1)}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={FocusAreaController.edit.url(focusArea.id)}>
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={processing}
                                                onClick={() => handleDelete(focusArea.id)}
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
            </div>
        </>
    );
}

FocusAreas.layout = {
    breadcrumbs: [
        {
            title: 'Focus Areas',
            href: FocusAreaController.index.url(),
        },
    ],
};
