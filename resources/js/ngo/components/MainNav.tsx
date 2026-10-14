import { Link, usePage } from "@inertiajs/react";
import navData from "../data/nav.json";
import type { NavLink } from "../data/siteData";

// Reports hidden for now — remove this filter to restore the nav link.
const links = (navData.main as NavLink[]).filter((link) => link.href !== "#reports");

type MainNavProps = {
  onNavigate?: () => void;
};

export function MainNav({ onNavigate }: MainNavProps) {
  const { url } = usePage();
  const onHome = url.split("?")[0] === "/";

  return (
    <nav className="main-nav" id="main-nav" aria-label="Main navigation">
      {links.map((link) => {
        const isHash = link.href.startsWith("#");
        const href = isHash && !onHome ? `/${link.href}` : link.href;
        const className = link.primary ? "btn" : undefined;

        return isHash ? (
          <a key={link.href} className={className} href={href} onClick={onNavigate}>
            {link.label}
          </a>
        ) : (
          <Link key={link.href} className={className} href={href} onClick={onNavigate}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
