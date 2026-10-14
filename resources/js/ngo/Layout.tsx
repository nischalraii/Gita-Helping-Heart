import type { ReactNode } from 'react';
import './styles.css';
import type { SiteSettings } from './data/siteData';
import { useReveal } from './hooks/useReveal';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

type NgoLayoutProps = {
  settings: SiteSettings;
  children: ReactNode;
};

/**
 * Shared public-site shell: top bar, header, main content and footer.
 * Every public page renders inside this so the scoped NGO styles apply.
 */
export function NgoLayout({ settings, children }: NgoLayoutProps) {
  useReveal();

  return (
    <>
      <a className="skip-link" href="#home">Skip to content</a>
      <TopBar settings={settings} />
      <Header />

      <main id="home">{children}</main>

      <Footer settings={settings} />
    </>
  );
}
