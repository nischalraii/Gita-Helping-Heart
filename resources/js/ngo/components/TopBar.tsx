import type { SiteSettings } from "../data/siteData";
import { MailIcon, PinIcon } from "./icons";

export function TopBar({ settings }: { settings: SiteSettings }) {
  return (
    <div className="top">
      <div className="wrap">
        <span><PinIcon />{settings.address}</span>
        <span><MailIcon />{settings.email} &nbsp; | &nbsp; EN / नेपाली</span>
      </div>
    </div>
  );
}
