import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { legal } from "@/data/legal";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy/" } };

export default function PrivacyPolicyPage() {
  return <LegalPage page={legal["privacy-policy"]} navTitle="Privacy Policy" />;
}
