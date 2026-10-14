import type { CSSProperties } from "react";
import { heroContent } from "../data/siteData";
import { ArrowIcon, HeartIcon } from "./icons";

function Marquee() {
  const words = heroContent.eyebrow.split("•").map((word) => word.trim());
  // Two identical halves make the -50% track translation loop seamlessly.
  const half = [...words, ...words, ...words, ...words];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((halfIndex) => (
          <div className="marquee-half" key={halfIndex}>
            {half.map((word, i) => (
              <span className="marquee-item" key={i}>
                {word}
                <HeartIcon />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-copy">
        <div className="eyebrow reveal">{heroContent.eyebrow}</div>
        <h1 className="reveal" style={{ "--d": "90ms" } as CSSProperties}>
          {heroContent.title.split(heroContent.highlight)[0]}
          <span className="hl">{heroContent.highlight}</span>
          {heroContent.title.split(heroContent.highlight)[1]}
        </h1>
        <p className="lede reveal" style={{ "--d": "170ms" } as CSSProperties}>
          {heroContent.description}
        </p>
        <div className="actions reveal" style={{ "--d": "240ms" } as CSSProperties}>
          <a className="btn" href="#work">
            {heroContent.primaryButton}
            <ArrowIcon />
          </a>
          <a className="btn ghost" href="#involved">{heroContent.secondaryButton}</a>
        </div>
        <div className="chips reveal" style={{ "--d": "310ms" } as CSSProperties}>
          {heroContent.chips.map((chip) => (
            <span key={chip} className="chip">{chip}</span>
          ))}
        </div>
      </div>

      <div className="wrap">
        <div className="hero-banner reveal" style={{ "--d": "380ms" } as CSSProperties}>
          <img src="/photos/hero-community.jpg" alt="Smiling children in the community raising peace signs" />
          <div className="sticker" aria-hidden="true">
            <HeartIcon />
          </div>
        </div>
      </div>

      <Marquee />
    </section>
  );
}
