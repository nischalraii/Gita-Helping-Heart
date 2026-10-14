import type { CSSProperties } from "react";
import ctaData from "../data/cta.json";
import type { CtaContent } from "../data/siteData";
import { ArrowIcon, HeartIcon } from "./icons";

const cta = ctaData as CtaContent;

export function CtaBanner() {
  return (
    <section id="involved" className="cta-section">
      <span className="cta-heart cta-heart-a" aria-hidden="true"><HeartIcon /></span>
      <span className="cta-heart cta-heart-b" aria-hidden="true"><HeartIcon /></span>
      <span className="cta-heart cta-heart-c" aria-hidden="true"><HeartIcon /></span>

      <div className="wrap">
        <h2 className="reveal">{cta.heading}</h2>
        <p className="cta-text reveal" style={{ "--d": "90ms" } as CSSProperties}>
          {cta.text}
        </p>
        <div className="reveal" style={{ "--d": "180ms" } as CSSProperties}>
          <a className="btn" href={cta.buttonHref}>
            {cta.buttonLabel}
            <ArrowIcon />
          </a>
        </div>
        {/* <p className="note reveal" style={{ "--d": "260ms" } as CSSProperties}> */}
        {/*   {cta.disclaimer} */}
        {/* </p> */}
      </div>
    </section>
  );
}
