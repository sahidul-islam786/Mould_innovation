// Company facts, copied from the live site (docs/source-audit/pages/contactus.txt, home.txt).
export const company = {
  name: "Mould Innovation",
  legalName: "Mould Innovation Private Limited",
  email: "hello@mouldinnovation.com",
  phone: "+91 9903940000",
  phoneDisplay: "+91 99039 40000",
  address: "Lords 605, 7/1 Lord Sinha Road, Kolkata 700071",
  // The live "Book a 30-min AI Discovery Call" button is a phone link (user decision Q3).
  discoveryCall: {
    label: "Book a 30-min AI Discovery Call",
    href: "tel:+919903940000",
  },
  social: [
    { label: "LinkedIn", href: "https://in.linkedin.com/company/mould-innovtion" },
    { label: "Facebook", href: "https://www.facebook.com/mouldinnovation/" },
    { label: "Instagram", href: "https://www.instagram.com/mouldinnovation/" },
  ],
  siteUrl: "https://www.mouldinnovation.com",
} as const;
