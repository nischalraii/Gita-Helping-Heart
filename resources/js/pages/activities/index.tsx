import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { NgoLayout } from '@/ngo/Layout';
import { ActivityCard } from '@/ngo/components/ActivityCard';
import { ArrowIcon } from '@/ngo/components/icons';
import { resolveActivityImage } from '@/ngo/data/siteData';
import type { ActivityItem, SiteSettings } from '@/ngo/data/siteData';
import { home } from '@/routes';

type ActivitiesIndexProps = {
    activities: ActivityItem[];
    settings: SiteSettings;
};

export default function ActivitiesIndex({ activities, settings }: ActivitiesIndexProps) {
    const [activeTag, setActiveTag] = useState<string | null>(null);

    const tags = useMemo(
        () => Array.from(new Set(activities.map((activity) => activity.tag).filter(Boolean))),
        [activities],
    );

    const visible = activeTag
        ? activities.filter((activity) => activity.tag === activeTag)
        : activities;

    return (
        <>
            <Head title="Activities" />

            <NgoLayout settings={settings}>
                <section className="page-hero">
                    <div className="wrap">
                        <nav className="crumbs" aria-label="Breadcrumb">
                            <Link href={home.url()}>Home</Link>
                            <span aria-hidden="true">/</span>
                            <span aria-current="page">Activities</span>
                        </nav>

                        <div className="eyebrow reveal">Our Activities</div>
                        <h1 className="reveal">
                            Stories of <span className="hl">Change</span>
                        </h1>
                        <p className="lede reveal">
                            Every camp, clean-up and classroom we run is driven by the communities
                            we serve. Explore the work behind each helping heart.
                        </p>

                        <div className="chips reveal">
                            <span className="chip">
                                {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
                            </span>
                            <span className="chip">
                                {tags.length} {tags.length === 1 ? 'program area' : 'program areas'}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="activities-section">
                    <div className="wrap">
                        {activities.length > 0 && (
                            <div className="filters reveal">
                                <div className="filter-chips" role="group" aria-label="Filter activities by program area">
                                    <button
                                        type="button"
                                        className="filter-chip"
                                        aria-pressed={activeTag === null}
                                        onClick={() => setActiveTag(null)}
                                    >
                                        All
                                    </button>
                                    {tags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            className="filter-chip"
                                            aria-pressed={activeTag === tag}
                                            onClick={() => setActiveTag(tag)}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>

                                <p className="filter-count" role="status" aria-atomic="true">
                                    Showing {visible.length} of {activities.length} activities
                                </p>
                            </div>
                        )}

                        {visible.length === 0 ? (
                            <div className="empty-state">
                                <p>No activities match this filter yet.</p>
                                {activeTag && (
                                    <button
                                        type="button"
                                        className="btn ghost"
                                        onClick={() => setActiveTag(null)}
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="activities-grid">
                                {visible.map((item, i) => (
                                    <ActivityCard
                                        key={item.id ?? i}
                                        {...item}
                                        image={resolveActivityImage(item.image)}
                                        index={i + 1}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="cta-section cta-slim">
                    <div className="wrap">
                        <h2 className="reveal">Every Helping Heart Matters.</h2>
                        <p className="cta-text reveal">
                            Volunteer, partner with us, or share a genuine community need for review.
                        </p>
                        <div className="reveal">
                            <a className="btn" href={`${home.url()}#contact`}>
                                Contact the Organization
                                <ArrowIcon />
                            </a>
                        </div>
                    </div>
                </section>
            </NgoLayout>
        </>
    );
}
