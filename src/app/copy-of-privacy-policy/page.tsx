import type { Metadata } from "next";
import { Moved } from "@/components/sections/Moved";

export const metadata: Metadata = { title: "Refund & Cancellation Policy", robots: { index: false } };

export default function OldRefundPage() {
  return <Moved to="/refund-cancellation-policy/" label="Refund & Cancellation Policy" />;
}
