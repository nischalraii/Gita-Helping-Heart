import { Form, Head, usePage } from '@inertiajs/react';
import FocusAreaController from '@/actions/App/Http/Controllers/FocusAreaController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FocusAreaItem } from '@/ngo/data/siteData';

type PageProps = {
    focusArea?: FocusAreaItem;
    icons: string[];
};

const selectClass =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const textareaClass =
    'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export default function FocusAreaForm() {
    const { focusArea, icons } = usePage<PageProps>().props;

    return (
        <>
            <Head title={focusArea ? 'Edit focus area' : 'New focus area'} />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title={focusArea ? 'Edit focus area' : 'New focus area'}
                    description={
                        focusArea
                            ? 'Update the focus area details.'
                            : 'Add a card to the “Where We Focus” section.'
                    }
                />

                <Form
                    {...(focusArea
                        ? FocusAreaController.update.form(focusArea.id)
                        : FocusAreaController.store.form())}
                    options={{ preserveScroll: true }}
                    className="max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="icon">Icon</Label>
                                <select
                                    id="icon"
                                    name="icon"
                                    defaultValue={focusArea?.icon ?? icons[0]}
                                    className={selectClass}
                                >
                                    {icons.map((icon) => (
                                        <option key={icon} value={icon}>
                                            {icon}
                                        </option>
                                    ))}
                                </select>
                                <InputError className="mt-2" message={errors.icon} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={focusArea?.title ?? ''}
                                    required
                                    placeholder="Children & Education"
                                />
                                <InputError className="mt-2" message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="text">Text</Label>
                                <textarea
                                    id="text"
                                    name="text"
                                    rows={4}
                                    required
                                    defaultValue={focusArea?.text ?? ''}
                                    placeholder="Short description of the program area."
                                    className={textareaClass}
                                />
                                <InputError className="mt-2" message={errors.text} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {focusArea ? 'Save changes' : 'Create focus area'}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

FocusAreaForm.layout = {
    breadcrumbs: [
        {
            title: 'Focus Areas',
            href: FocusAreaController.index.url(),
        },
    ],
};
