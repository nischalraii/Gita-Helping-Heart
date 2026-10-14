import { Head, useForm, usePage } from '@inertiajs/react';
import { Check, Eye, RotateCcw, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import EnquiryController from '@/actions/App/Http/Controllers/EnquiryController';
import Heading from '@/components/heading';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Paginator } from '@/types';

type Enquiry = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    location: string | null;
    message: string;
    handled_at: string | null;
    created_at: string;
};

type PageProps = {
    enquiries: Paginator<Enquiry>;
};

export default function Enquiries() {
    const { enquiries } = usePage<PageProps>().props;
    const { patch, delete: destroy, processing } = useForm();
    const [selected, setSelected] = useState<Enquiry | null>(null);

    const toggleHandled = (id: number) => {
        patch(EnquiryController.update.url(id), {
            preserveScroll: true,
            onSuccess: () => setSelected(null),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this enquiry?')) {
            destroy(EnquiryController.destroy.url(id), {
                preserveScroll: true,
                onSuccess: () => setSelected(null),
            });
        }
    };

    return (
        <>
            <Head title="Enquiries" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title="Enquiries"
                    description="Messages submitted from the landing page contact form."
                />

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left">
                                <th className="px-4 py-2 font-medium">Name</th>
                                <th className="px-4 py-2 font-medium">Email</th>
                                <th className="px-4 py-2 font-medium">Subject</th>
                                <th className="px-4 py-2 font-medium">Received</th>
                                <th className="px-4 py-2 font-medium">Status</th>
                                <th className="px-4 py-2 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enquiries.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                                        No enquiries yet.
                                    </td>
                                </tr>
                            )}
                            {enquiries.data.map((enquiry) => (
                                <tr key={enquiry.id} className="border-b last:border-0">
                                    <td className="px-4 py-2 font-medium">{enquiry.name}</td>
                                    <td className="px-4 py-2">
                                        <a href={`mailto:${enquiry.email}`} className="hover:underline">
                                            {enquiry.email}
                                        </a>
                                    </td>
                                    <td className="px-4 py-2">{enquiry.subject}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                                        {new Date(enquiry.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        {enquiry.handled_at ? (
                                            <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                Handled
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                New
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelected(enquiry)}
                                        >
                                            <Eye className="h-4 w-4" />
                                            Detail
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={enquiries} />
            </div>

            <Dialog
                open={selected !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelected(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selected?.subject}</DialogTitle>
                        <DialogDescription>
                            Enquiry from {selected?.name}
                        </DialogDescription>
                    </DialogHeader>

                    {selected && (
                        <div className="space-y-3 text-sm">
                            <DetailRow label="From" value={selected.name} />
                            <DetailRow
                                label="Email"
                                value={
                                    <a href={`mailto:${selected.email}`} className="hover:underline">
                                        {selected.email}
                                    </a>
                                }
                            />
                            {selected.phone && <DetailRow label="Phone" value={selected.phone} />}
                            {selected.location && <DetailRow label="Location" value={selected.location} />}
                            <DetailRow
                                label="Received"
                                value={new Date(selected.created_at).toLocaleString()}
                            />
                            <DetailRow label="Status" value={selected.handled_at ? 'Handled' : 'New'} />
                            <div>
                                <div className="text-muted-foreground">Message</div>
                                <p className="mt-1 rounded-md border bg-muted/40 p-3 whitespace-pre-wrap break-words">
                                    {selected.message}
                                </p>
                            </div>
                        </div>
                    )}

                    {selected && (
                        <DialogFooter>
                            <Button
                                variant="outline"
                                disabled={processing}
                                onClick={() => toggleHandled(selected.id)}
                            >
                                {selected.handled_at ? (
                                    <RotateCcw className="h-4 w-4" />
                                ) : (
                                    <Check className="h-4 w-4" />
                                )}
                                {selected.handled_at ? 'Reopen' : 'Mark handled'}
                            </Button>
                            <Button
                                variant="destructive"
                                disabled={processing}
                                onClick={() => handleDelete(selected.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="grid grid-cols-[90px_1fr] gap-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="break-words">{value}</span>
        </div>
    );
}

Enquiries.layout = {
    breadcrumbs: [
        {
            title: 'Enquiries',
            href: EnquiryController.index.url(),
        },
    ],
};
