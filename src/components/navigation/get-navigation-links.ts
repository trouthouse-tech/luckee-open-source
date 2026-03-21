export type NavigationLinkChild = {
  name: string;
  href: string;
};

/** Parent row is label + chevron only (no destination). */
export type NavigationSection = {
  name: string;
  children: NavigationLinkChild[];
};

/** Top-level link, optional nested children (e.g. Leads). */
export type NavigationRoute = {
  name: string;
  href: string;
  children?: NavigationLinkChild[];
};

export type NavigationLink = NavigationSection | NavigationRoute;

export const getNavigationLinks = (): NavigationLink[] => {
  return [
    {
      name: 'Dashboard',
      href: '/',
    },
    {
      name: 'Leads',
      href: '/leads',
      children: [
        { name: 'Find Leads', href: '/leads/find' },
        { name: 'Email Queue', href: '/lead-contact-email-queue' },
        { name: 'Lead Contacts', href: '/lead-contacts' },
        { name: 'Lead Sent Emails', href: '/lead-sent-emails' },
      ],
    },
    {
      name: 'Customers',
      href: '/customers',
    },
    {
      name: 'Projects',
      href: '/projects',
    },
    {
      name: 'Tickets',
      href: '/tickets',
    },
    {
      name: 'Time Tracking',
      href: '/time-tracking',
    },
  ];
};
