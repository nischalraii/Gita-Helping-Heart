export type FeatureIcon = "community" | "education" | "health" | "skills" | "environment" | "awareness";

export type FeatureItem = {
  icon: FeatureIcon;
  title: string;
  text: string;
};

export type FocusAreaItem = FeatureItem & {
  id: number;
  sort_order: number;
};

export type ActivityItem = {
  id?: number;
  tag: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  description?: string;
  image?: string;
};

/**
 * Normalise a stored activity image path into a public URL.
 */
export function resolveActivityImage(image?: string | null): string | undefined {
  if (!image) {
    return undefined;
  }

  return image.startsWith('/') ? image : `/storage/${image}`;
}

export type HeroContent = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
  chips: string[];
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  description: string;
  purposeEyebrow: string;
  purposeTitle: string;
  purposeText: string;
  checks: string[];
};

export type NavLink = {
  label: string;
  href: string;
  primary?: boolean;
};

export type ReportItem = {
  title: string;
  text: string;
};

export type SiteSettings = {
  address: string;
  address_short: string | null;
  email: string;
  phone: string | null;
  map_embed_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  whatsapp_url: string | null;
};

export type CtaContent = {
  heading: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
  disclaimer: string;
};

export const heroContent: HeroContent = {
  eyebrow: "Compassion • Service • Empowerment",
  title: "Together, We Can Build Stronger Communities.",
  highlight: "Stronger Communities",
  description:
    "Gita Helping Hearts, Nepal works for the dignity, empowerment and all-round development of vulnerable people through social support, education, health, skills, awareness and environmental action.",
  primaryButton: "Explore Our Work",
  secondaryButton: "Get Involved",
  chips: ["Non-profit • Public welfare", "Godawari, Lalitpur, Nepal", "Serving people with dignity"],
};

export const aboutContent: AboutContent = {
  eyebrow: "Who We Are",
  title: "Helping Hearts in Action",
  description:
    "We are a non-profit public-welfare social organization based in Godawari, Lalitpur. Our objectives focus on supporting vulnerable people, creating opportunities for self-reliance, strengthening communities and encouraging responsible social service.",
  purposeEyebrow: "Our purpose",
  purposeTitle: "Compassion Connected to Practical Community Action",
  purposeText:
    "Our work is intended to rise above divisions of caste, class, politics and community background and serve people with dignity and respect.",
  checks: [
    "✓ Non-profit public welfare",
    "✓ Inclusion & dignity",
    "✓ Skills & self-reliance",
    "✓ Community partnership",
  ],
};

