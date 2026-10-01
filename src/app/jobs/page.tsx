import type { Metadata } from "next";
import { Moved } from "@/components/sections/Moved";

export const metadata: Metadata = { title: "Careers", robots: { index: false } };

export default function OldJobsPage() {
  return <Moved to="/careers/" label="Careers" />;
}
