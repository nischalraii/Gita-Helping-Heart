import { Link } from "@inertiajs/react";
import { index as activitiesIndex } from "@/routes/activities";
import type { ActivityItem } from "../data/siteData";
import { SectionHeader } from "./SectionHeader";
import { ActivityCard } from "./ActivityCard";

export function Activities({ items }: { items: ActivityItem[] }) {
  return (
    <section id="activities">
      <div className="wrap">
        <SectionHeader
          eyebrow="Activities"
          title="Recent Work"
          text="The developer should populate these cards only with real, verified NGO activities."
        />

        <div className="activities-grid">
          {items.map((item, i) => (
            <ActivityCard key={item.id ?? i} {...item} index={i} />
          ))}
        </div>

        <div className="activities-more">
          <Link className="btn" href={activitiesIndex.url()}>
            View all activities
          </Link>
        </div>
      </div>
    </section>
  );
}
