import {
  GraduationCap,
  HeartPulse,
  Megaphone,
  Sprout,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import type { FeatureItem } from "../data/siteData";
import { ArrowIcon } from "./icons";

const icons: Record<FeatureItem["icon"], LucideIcon> = {
  community: Users,
  education: GraduationCap,
  health: HeartPulse,
  skills: Wrench,
  environment: Sprout,
  awareness: Megaphone,
};

type FeatureCardProps = FeatureItem & { index: number };

export function FeatureCard({ icon, title, text, index }: FeatureCardProps) {
  const Icon = icons[icon] ?? Users;

  return (
    <div
      className="card feature reveal"
      style={{ "--d": `${(index % 3) * 90}ms` } as CSSProperties}
    >
      <div className="card-top">
        <div className="icon">
          <Icon size={28} strokeWidth={1.8} />
        </div>
        <span className="card-num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="card-arrow" aria-hidden="true">
        <ArrowIcon />
      </span>
    </div>
  );
}
