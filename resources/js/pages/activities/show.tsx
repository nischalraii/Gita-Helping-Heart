import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { NgoLayout } from '@/ngo/Layout';
import { ActivityCard } from '@/ngo/components/ActivityCard';
import {
    ArrowIcon,
    ArrowLeftIcon,
    CalendarIcon,
    FacebookIcon,
    HeartIcon,
    LinkIcon,
    PinIcon,
    WhatsAppIcon,
} from '@/ngo/components/icons';
import { resolveActivityImage } from '@/ngo/data/siteData';
import type { ActivityItem, SiteSettings } from '@/ngo/data/siteData';
import { index as activitiesIndex } from '@/routes/activities';
import { home } from '@/routes';

type ActivityShowProps = {
    activity: ActivityItem;
    related: ActivityItem[];
    settings: SiteSettings;
};

export default function ActivityShow({ activity, related, settings }: ActivityShowProps) {
    const image = resolveActivityImage(activity.image);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);

    // Read the absolute URL only after mount so SSR and hydration match.
    useEffect(() => {
        setShareUrl(window.location.href);
    }, []);

    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${activity.title} ${shareUrl}`)}`;

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard access can be blocked; the share links still work.
        }
    };

    return (
        <>
            <Head title={activity.title} />

            <NgoLayout settings={settings}>
                <div className="activity-page">
                    <div className="wrap">
                        <nav className="crumbs" aria-label="Breadcrumb">
                            <Link href={home.url()}>Home</Link>
                            <span aria-hidden="true">/</span>
                            <Link href={activitiesIndex.url()}>Activities</Link>
                            <span aria-hidden="true">/</span>
                            <span aria-current="page">{activity.title}</span>
                        </nav>

                        <div className="activity-hero reveal">
                            {image ? (
                                <img src={image} alt={activity.title} />
                            ) : (
                                <div className="activity-hero-fallback" aria-hidden="true">
                                    <HeartIcon />
                                </div>
                            )}
                            <span className="tag">{activity.tag}</span>
                        </div>

                        <div className="activity-layout">
                            <article className="activity-story">
                                <h1>{activity.title}</h1>

                                <div className="activity-meta">
                                    <span>
                                        <CalendarIcon aria-hidden="true" />
                                        {activity.date}
                                    </span>
                                    <span>
                                        <PinIcon aria-hidden="true" />
                                        {activity.location}
                                    </span>
                                </div>

                                <p className="activity-lead">{activity.summary}</p>

                                {activity.description && (
                                    <div className="prose-body">{activity.description}</div>
                                )}
                            </article>

                            <aside className="activity-aside">
                                <div className="meta-card">
                                    <div className="meta-row">
                                        <CalendarIcon aria-hidden="true" />
                                        <div>
                                            <span className="meta-label">When</span>
                                            <span className="meta-value">{activity.date}</span>
                                        </div>
                                    </div>
                                    <div className="meta-row">
                                        <PinIcon aria-hidden="true" />
                                        <div>
                                            <span className="meta-label">Where</span>
                                            <span className="meta-value">{activity.location}</span>
                                        </div>
                                    </div>

                                    <a className="btn" href={`${home.url()}#contact`}>
                                        Get involved
                                        <ArrowIcon />
                                    </a>

                                    <div className="share">
                                        <span className="share-label">Share</span>
                                        <div className="share-buttons">
                                            <button
                                                type="button"
                                                className="share-button"
                                                onClick={copyLink}
                                                aria-label="Copy link"
                                            >
                                                <LinkIcon />
                                            </button>
                                            <a
                                                className="share-button"
                                                href={facebookShare}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label="Share on Facebook"
                                            >
                                                <FacebookIcon />
                                            </a>
                                            <a
                                                className="share-button"
                                                href={whatsappShare}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label="Share on WhatsApp"
                                            >
                                                <WhatsAppIcon />
                                            </a>
                                        </div>
                                        {copied && (
                                            <span className="share-copied" role="status" aria-atomic="true">
                                                Link copied
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </div>

                        <Link className="back-link" href={activitiesIndex.url()}>
                            <ArrowLeftIcon aria-hidden="true" />
                            All activities
                        </Link>
                    </div>

                    {related.length > 0 && (
                        <section className="related">
                            <div className="wrap">
                                <h2>More from our work</h2>
                                <div className="activities-grid">
                                    {related.map((item, i) => (
                                        <ActivityCard
                                            key={item.id ?? i}
                                            {...item}
                                            image={resolveActivityImage(item.image)}
                                            index={i + 1}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </NgoLayout>
        </>
    );
}
