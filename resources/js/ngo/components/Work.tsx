import type { FeatureItem } from "../data/siteData";
import { SectionHeader } from "./SectionHeader";
import { FeatureCard } from "./FeatureCard";

export function Work({ items }: { items: FeatureItem[] }) {
  return (
    <section id="work" className="alt">
      <div className="wrap">
        <SectionHeader
          eyebrow="Our Work"
          title="Where We Focus"
          text="These program areas are drafted from the objectives in the NGO constitution pages provided for this website."
        />

        <div className="work-grid">
          {items.map((item, i) => (
            <FeatureCard key={item.title} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
