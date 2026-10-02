import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { legal } from "@/data/legal";

export const metadata: Metadata = { title: "Refund & Cancellation Policy", alternates: { canonical: "/refund-cancellation-policy/" } };

export default function RefundPolicyPage() {
  return <LegalPage page={legal["refund-cancellation-policy"]} navTitle="Refund & Cancellation Policy" />;
}
