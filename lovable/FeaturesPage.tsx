/**
 * Landing page — /landing & /features
 * Two-column layout: left hero + right structured feature surface.
 * Only OSS modules shown. Single "Learn about Pro" CTA links out.
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Target, Mail, Users as UsersIcon, Contact,
  Send, FolderKanban, Ticket, Clock,
  ArrowRight, ArrowUpRight, Sparkles, ExternalLink,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─── Types ─── */
interface FeatureItem {
  icon: LucideIcon;
  tag: string;
  title: string;
  desc: string;
}

interface FeatureCategory {
  label: string;
  items: FeatureItem[];
}

/* ─── Data ─── */
const PILLARS = [
  { value: '9', label: 'Modules' },
  { value: 'Free', label: 'Self-host' },
  { value: 'OSS', label: 'MIT license' },
];

const CATEGORIES: FeatureCategory[] = [
  {
    label: 'Pipeline',
    items: [
      { icon: Target, tag: 'leads', title: 'Find Leads', desc: 'Discover and organize prospects in one place.' },
      { icon: Mail, tag: 'outbound', title: 'Email Queue', desc: 'Queue and schedule outreach without leaving the app.' },
      { icon: Contact, tag: 'contacts', title: 'Lead Contacts', desc: 'Keep every contact and conversation thread together.' },
      { icon: Send, tag: 'tracking', title: 'Sent Emails', desc: 'See what was sent, opened, and replied to.' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { icon: LayoutDashboard, tag: 'home', title: 'Dashboard', desc: 'A single view of what matters today.' },
      { icon: UsersIcon, tag: 'crm', title: 'Customers', desc: 'Customer records with context, not just rows.' },
      { icon: FolderKanban, tag: 'delivery', title: 'Projects', desc: 'Track work from kickoff to delivery.' },
      { icon: Ticket, tag: 'support', title: 'Tickets', desc: 'Log and resolve issues before they pile up.' },
      { icon: Clock, tag: 'productivity', title: 'Time Tracking', desc: 'Know where your hours go.' },
    ],
  },
];

/* ─── Feature Card ─── */
const FeatureCard = ({ item }: { item: FeatureItem }) => (
  <div className={styles.card}>
    <div className={styles.cardTop}>
      <div className={styles.cardIconWrap}>
        <item.icon className={styles.cardIcon} />
      </div>
    </div>
    <span className={styles.cardTag}>{item.tag}</span>
    <h3 className={styles.cardTitle}>{item.title}</h3>
    <p className={styles.cardDesc}>{item.desc}</p>
    <ArrowUpRight className={styles.cardArrow} />
  </div>
);

/* ─── Nav ─── */
const FeaturesNav = () => (
  <nav className={styles.nav}>
    <div className={styles.navInner}>
      <Link to="/landing" className={styles.logoLink}>
        <span className={styles.logoMark}>L</span>
        <span className={styles.logoText}>Luckee</span>
      </Link>
      <div className={styles.navLinks}>
        <Link to="/landing" className={styles.navLinkActive}>Home</Link>
        <Link to="/docs" className={styles.navLink}>Docs</Link>
      </div>
      <div className={styles.navActions}>
        <Link to="/sign-in"><Button variant="ghost" size="sm">Log in</Button></Link>
        <Link to="/sign-up"><Button size="sm">Get started</Button></Link>
      </div>
    </div>
  </nav>
);

/* ─── Footer ─── */
const FeaturesFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.footerInner}>
      <div className={styles.footerBrand}>
        <span className={styles.logoMark}>L</span>
        <span className={styles.footerWordmark}>Luckee</span>
      </div>
      <div className={styles.footerLinks}>
        <a href="#" className={styles.footerLink}>Privacy</a>
        <a href="#" className={styles.footerLink}>Terms</a>
      </div>
      <p className={styles.footerCopy}>© {new Date().getFullYear()} Luckee. All rights reserved.</p>
    </div>
  </footer>
);

/* ═══ Page ═══ */
export const FeaturesPage = () => (
  <div className={styles.page}>
    <FeaturesNav />
    <div className={styles.twoCol}>
      {/* Left column */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.leftBadge}>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Open source</span>
          </div>
          <h1 className={styles.leftHeading}>
            The founder workspace for{' '}
            <span className={styles.leftAccent}>pipeline and delivery.</span>
          </h1>
          <p className={styles.leftSub}>
            Leads, contacts, outbound, customers, projects, and support — in one app you can self-host.
          </p>
          <div className={styles.leftCtas}>
            <Link to="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" className={styles.ctaPrimary}>
                <ExternalLink className="h-4 w-4" />
                <span>Get started</span>
              </Button>
            </Link>
            <Link to="/features" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className={styles.ctaSecondary}>
                Learn about Pro
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          {/* Stat pillars */}
          <div className={styles.pillars}>
            {PILLARS.map((p) => (
              <div key={p.label} className={styles.pillar}>
                <span className={styles.pillarValue}>{p.value}</span>
                <span className={styles.pillarLabel}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className={styles.right}>
        <div className={styles.rightInner}>
          <h2 className={styles.rightHeading}>What's in the box</h2>
          <p className={styles.rightSub}>
            Everything you get when you self-host.
          </p>

          {CATEGORIES.map((cat) => (
            <div key={cat.label} className={styles.categoryBlock}>
              <span className={styles.categoryLabel}>{cat.label}</span>
              <div className={styles.cardsGrid}>
                {cat.items.map((item) => (
                  <FeatureCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <FeaturesFooter />
  </div>
);

/* ═══ Styles ═══ */
const styles = {
  page: `min-h-screen bg-background text-foreground`,

  // Nav
  nav: `sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80`,
  navInner: `max-w-7xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6`,
  logoLink: `flex items-center gap-2`,
  logoMark: `flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm`,
  logoText: `text-base font-semibold text-foreground tracking-tight`,
  navLinks: `hidden md:flex items-center gap-1`,
  navLink: `text-sm px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors`,
  navLinkActive: `text-sm px-3 py-1.5 rounded-md text-foreground font-medium bg-muted`,
  navActions: `flex items-center gap-2`,

  // Two-column shell
  twoCol: `flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]`,

  // Left
  left: `lg:w-[45%] lg:border-r border-border lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] flex items-center`,
  leftInner: `w-full max-w-lg mx-auto px-6 sm:px-10 py-16 lg:py-0`,
  leftBadge: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground mb-6`,
  leftHeading: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.1]`,
  leftAccent: `text-primary`,
  leftSub: `mt-5 text-base text-muted-foreground leading-relaxed`,
  leftCtas: `mt-8 flex flex-col sm:flex-row gap-3`,
  ctaPrimary: `gap-2`,
  ctaSecondary: `gap-2`,

  // Pillars
  pillars: `mt-10 pt-6 border-t border-border grid grid-cols-3 gap-4`,
  pillar: `flex flex-col`,
  pillarValue: `text-2xl font-bold text-foreground`,
  pillarLabel: `text-xs text-muted-foreground mt-0.5`,

  // Right
  right: `lg:w-[55%] bg-muted/30`,
  rightInner: `max-w-2xl mx-auto px-6 sm:px-10 py-16`,
  rightHeading: `text-2xl font-bold text-foreground`,
  rightSub: `mt-1 text-sm text-muted-foreground mb-10`,

  // Category
  categoryBlock: `mb-10 last:mb-0`,
  categoryLabel: `text-[11px] font-mono uppercase tracking-[0.15em] text-primary font-semibold mb-4 block`,

  // Cards
  cardsGrid: `grid grid-cols-1 sm:grid-cols-2 gap-3`,
  card: `relative group p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors`,
  cardTop: `flex items-center justify-between mb-3`,
  cardIconWrap: `w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center`,
  cardIcon: `h-4 w-4 text-primary`,
  cardTag: `text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground mb-1 block`,
  cardTitle: `text-sm font-semibold text-foreground`,
  cardDesc: `mt-1 text-xs text-muted-foreground leading-relaxed`,
  cardArrow: `absolute top-4 right-4 h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-primary transition-colors hidden sm:block`,

  // Footer
  footer: `border-t border-border py-8 px-4`,
  footerInner: `max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4`,
  footerBrand: `flex items-center gap-2`,
  footerWordmark: `text-sm font-semibold text-foreground`,
  footerLinks: `flex gap-4`,
  footerLink: `text-sm text-muted-foreground hover:text-foreground transition-colors`,
  footerCopy: `text-xs text-muted-foreground`,
};
