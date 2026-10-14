import type { CSSProperties } from "react";
import { Link } from "@inertiajs/react";
import { show } from "@/routes/activities";
import type { ActivityItem } from "../data/siteData";
import { ArrowIcon } from "./icons";

type ActivityCardProps = ActivityItem & { index: number };

export function ActivityCard({ id, tag, title, date, location, summary, image, index }: ActivityCardProps) {
  const featured = index === 0;
  const className = `card activity reveal${featured ? " featured" : ""}`;
  const style = { "--d": `${index * 90}ms` } as CSSProperties;

  const content = (
    <>
      <div className="activity-media">
        <img className="activity-img" src={image || "/activity-placeholder.svg"} alt={image ? "Community activity photo" : "Activity photo placeholder"} />
        <span className="tag">{tag || "Program Area"}</span>
      </div>
      <div className="activity-body">
        <h3>{title || "Activity Title"}</h3>
        <p className="small">
          {date || "Date"} • {location || "Location"}
        </p>
        <p>{summary || "Activity summary coming soon."}</p>
        {id && (
          <span className="activity-more">
            Read more
            <ArrowIcon />
          </span>
        )}
      </div>
    </>
  );

  if (!id) {
    return (
      <article className={className} style={style}>
        {content}
      </article>
    );
  }

  return (
    <Link className={className} style={style} href={show.url(id)}>
      {content}
    </Link>
  );
}
