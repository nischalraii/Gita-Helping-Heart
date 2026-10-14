import { Form, Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ActivityController from '@/actions/App/Http/Controllers/ActivityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ActivityItem } from '@/ngo/data/siteData';

type PageProps = {
    activity?: ActivityItem;
};

const fields = [
    { name: 'title', label: 'Title', placeholder: 'Weekend Learning Support Camp' },
    { name: 'tag', label: 'Tag', placeholder: 'Children / Healthcare / Environment' },
    { name: 'date', label: 'Date', placeholder: 'Aug 2026' },
    { name: 'location', label: 'Location', placeholder: 'Rampur Village' },
] as const;

export default function ActivityForm() {
    const { activity } = usePage<PageProps>().props;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Revoke the temporary object URL when the form unmounts.
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const storedImageUrl = activity?.image
        ? activity.image.startsWith('/')
            ? activity.image
            : `/storage/${activity.image}`
        : null;

    const imageUrl = previewUrl ?? storedImageUrl;

    return (
        <>
            <Head title={activity ? 'Edit activity' : 'New activity'} />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title={activity ? 'Edit activity' : 'New activity'}
                    description={
                        activity
                            ? 'Update the activity details.'
                            : 'Add an activity to the landing page.'
                    }
                />

                <Form
                    {...(activity
                        ? ActivityController.update.form(activity.id!)
                        : ActivityController.store.form())}
                    options={{ preserveScroll: true }}
                    className="max-w-xl space-y-6"
                    encType="multipart/form-data"
                >
                    {({ processing, errors }) => (
                        <>
                            {fields.map(({ name, label, placeholder }) => (
                                <div key={name} className="grid gap-2">
                                    <Label htmlFor={name}>{label}</Label>
                                    <Input
                                        id={name}
                                        name={name}
                                        defaultValue={activity?.[name] ?? ''}
                                        required
                                        placeholder={placeholder}
                                    />
                                    <InputError className="mt-2" message={errors[name]} />
                                </div>
                            ))}

                            <div className="grid gap-2">
                                <Label htmlFor="summary">Summary</Label>
                                <textarea
                                    id="summary"
                                    name="summary"
                                    rows={4}
                                    required
                                    defaultValue={activity?.summary ?? ''}
                                    placeholder="What happened during the activity?"
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <InputError className="mt-2" message={errors.summary} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={8}
                                    defaultValue={activity?.description ?? ''}
                                    placeholder="Full details shown on the activity page (optional)."
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <InputError className="mt-2" message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Image</Label>
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt=""
                                        className="h-32 w-32 rounded-lg border object-cover"
                                    />
                                )}
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];

                                        if (previewUrl) {
                                            URL.revokeObjectURL(previewUrl);
                                        }

                                        setPreviewUrl(
                                            file ? URL.createObjectURL(file) : null,
                                        );
                                    }}
                                />
                                <InputError className="mt-2" message={errors.image} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {activity ? 'Save changes' : 'Create activity'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

ActivityForm.layout = {
    breadcrumbs: [
        {
            title: 'Activities',
            href: ActivityController.index.url(),
        },
    ],
};
