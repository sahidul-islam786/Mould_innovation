import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { legal } from "@/data/legal";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms-and-conditions/" } };

export default function TermsPage() {
  return <LegalPage page={legal["terms-and-conditions"]} navTitle="Terms & Conditions" />;
}
