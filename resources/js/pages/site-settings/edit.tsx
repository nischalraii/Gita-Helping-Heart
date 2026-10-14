import { Form, Head, usePage } from '@inertiajs/react';
import SiteSettingsController from '@/actions/App/Http/Controllers/SiteSettingsController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SiteSettings } from '@/ngo/data/siteData';

type PageProps = {
    settings: SiteSettings;
};

const contactFields = [
    {
        name: 'address',
        label: 'Address',
        placeholder: 'Godawari Municipality-14, Thaiba, Lalitpur, Nepal',
        type: 'text',
        required: true,
    },
    {
        name: 'address_short',
        label: 'Short address',
        placeholder: 'Godawari Municipality-14, Thaiba, Lalitpur',
        type: 'text',
        required: false,
    },
    {
        name: 'email',
        label: 'Email',
        placeholder: 'gita4gk@gmail.com',
        type: 'email',
        required: true,
    },
    {
        name: 'phone',
        label: 'Phone',
        placeholder: '+977 98XXXXXXXX',
        type: 'text',
        required: false,
    },
    {
        name: 'map_embed_url',
        label: 'Map embed URL',
        placeholder: 'https://www.google.com/maps/embed?pb=...',
        type: 'url',
        required: false,
    },
] as const;

const socialFields = [
    { name: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/...' },
    { name: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { name: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/@...' },
    { name: 'tiktok_url', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
    { name: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
    { name: 'twitter_url', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
    { name: 'whatsapp_url', label: 'WhatsApp', placeholder: 'https://wa.me/977...' },
] as const;

export default function SiteSettingsEdit() {
    const { settings } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Site Settings" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    variant="small"
                    title="Site Settings"
                    description="Contact details and social links shown on the landing page."
                />

                <Form
                    {...SiteSettingsController.update.form()}
                    options={{ preserveScroll: true }}
                    className="max-w-xl space-y-8"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-6">
                                {contactFields.map(({ name, label, placeholder, type, required }) => (
                                    <div key={name} className="grid gap-2">
                                        <Label htmlFor={name}>{label}</Label>
                                        <Input
                                            id={name}
                                            name={name}
                                            type={type}
                                            required={required}
                                            defaultValue={settings[name] ?? ''}
                                            placeholder={placeholder}
                                        />
                                        <InputError className="mt-2" message={errors[name]} />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-medium">Social links</h3>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    {socialFields.map(({ name, label, placeholder }) => (
                                        <div key={name} className="grid gap-2">
                                            <Label htmlFor={name}>{label}</Label>
                                            <Input
                                                id={name}
                                                name={name}
                                                type="url"
                                                defaultValue={settings[name] ?? ''}
                                                placeholder={placeholder}
                                            />
                                            <InputError className="mt-2" message={errors[name]} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" disabled={processing}>
                                Save changes
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

SiteSettingsEdit.layout = {
    breadcrumbs: [
        {
            title: 'Site Settings',
            href: SiteSettingsController.edit.url(),
        },
    ],
};
