export type NavItem = { label: string; href: string };

// Order and items follow the live site navigation.
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Projects", href: "/projects/" },
  { label: "Services", href: "/services/" },
  { label: "SaaS", href: "/saas/" },
  { label: "Careers", href: "/careers/" },
  { label: "Contact", href: "/contact/" },
];

// Footer order follows the live site.
export const legalNav: NavItem[] = [
  { label: "Refund & Cancellation Policy", href: "/refund-cancellation-policy/" },
  { label: "Terms and Conditions", href: "/terms-and-conditions/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
];
