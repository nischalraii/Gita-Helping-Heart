import { Link, usePage } from "@inertiajs/react";
import { Facebook, Instagram, Linkedin, MessageCircle, Twitter, Youtube } from "lucide-react";
import siteData from "../data/site.json";
import navData from "../data/nav.json";
import type { NavLink, SiteSettings } from "../data/siteData";
import { HeartIcon, TiktokIcon } from "./icons";

// Reports & Notices hidden for now — remove this filter to restore the footer link.
const quickLinks = (navData.quick as NavLink[]).filter((link) => link.href !== "#reports");

const socialLinks = [
  { key: "facebook_url", label: "Facebook", Icon: Facebook },
  { key: "instagram_url", label: "Instagram", Icon: Instagram },
  { key: "youtube_url", label: "YouTube", Icon: Youtube },
  { key: "tiktok_url", label: "TikTok", Icon: TiktokIcon },
  { key: "linkedin_url", label: "LinkedIn", Icon: Linkedin },
  { key: "twitter_url", label: "X (Twitter)", Icon: Twitter },
  { key: "whatsapp_url", label: "WhatsApp", Icon: MessageCircle },
] as const;

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = socialLinks.filter(({ key }) => settings[key]);
  const { url } = usePage();
  const onHome = url.split("?")[0] === "/";

  return (
    <footer>
      <div className="wrap">
        <div className="foot-heart" aria-hidden="true">
          <HeartIcon />
        </div>

        <div className="foot">
          <div>
            <h4>{siteData.name}</h4>
            <p>{siteData.nameNe}</p>
            <p>{siteData.footerTagline}</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            {quickLinks.map((link) => {
              const isHash = link.href.startsWith("#");
              const href = isHash && !onHome ? `/${link.href}` : link.href;

              return isHash ? (
                <a key={link.href} href={href}>{link.label}</a>
              ) : (
                <Link key={link.href} href={href}>{link.label}</Link>
              );
            })}
          </div>

          <div>
            <h4>Contact</h4>
            <p>{settings.address_short ?? settings.address}</p>
            <p>{settings.email}</p>

            {socials.length > 0 && (
              <ul className="socials">
                {socials.map(({ key, label, Icon }) => (
                  <li key={key}>
                    <a
                      href={settings[key]!}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                    >
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="foot-word" aria-hidden="true">{siteData.name}</div>

        <div className="legal">{siteData.legal}</div>
      </div>
    </footer>
  );
}
