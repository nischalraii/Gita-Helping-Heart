import type { CSSProperties } from "react";
import { aboutContent } from "../data/siteData";
import { SectionHeader } from "./SectionHeader";
import { HeartIcon } from "./icons";

export function About() {
  return (
    <section id="about">
      <div className="wrap about">
        <div className="about-box reveal">
          <div className="about-hearts" aria-hidden="true">
            <HeartIcon />
          </div>
          <div className="eyebrow">{aboutContent.eyebrow}</div>
          <h3>{aboutContent.title}</h3>
          <p>{aboutContent.description}</p>
        </div>

        <div>
          <SectionHeader
            eyebrow={aboutContent.purposeEyebrow}
            title={aboutContent.purposeTitle}
            text={aboutContent.purposeText}
          />

          <div className="checks">
            {aboutContent.checks.map((check, i) => (
              <div
                key={check}
                className="check reveal"
                style={{ "--d": `${i * 80}ms` } as CSSProperties}
              >
                {check}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
