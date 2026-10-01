import type { Metadata } from "next";
import { Moved } from "@/components/sections/Moved";

export const metadata: Metadata = { title: "Contact", robots: { index: false } };

export default function OldContactPage() {
  return <Moved to="/contact/" label="Contact" />;
}
