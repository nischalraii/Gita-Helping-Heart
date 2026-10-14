import type { ActivityItem, FocusAreaItem, SiteSettings } from "./data/siteData";
import { NgoLayout } from "./Layout";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Work } from "./components/Work";
import { Activities } from "./components/Activities";
import { CtaBanner } from "./components/CtaBanner";
// Reports section hidden for now.
// import { Reports } from "./components/Reports";
import { Contact } from "./components/Contact";

export default function App({
  activities,
  focusAreas,
  settings,
}: {
  activities: ActivityItem[];
  focusAreas: FocusAreaItem[];
  settings: SiteSettings;
}) {
  return (
    <NgoLayout settings={settings}>
      <Hero />
      <About />
      <Work items={focusAreas} />
      <Activities items={activities} />
      <CtaBanner />
      {/* Reports / Notices section commented out for now. */}
      {/* <Reports /> */}
      <Contact settings={settings} />
    </NgoLayout>
  );
}
