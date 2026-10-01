import content from "./content/legal.json";
import type { Block } from "./careers";

// Copied exactly from the live legal pages (user decision Q2). The live Privacy Policy and
// Refund & Cancellation pages currently contain Terms & Conditions text; kept as-is.
export type LegalPage = { title: string; updated?: string; body: Block[] };

export const legal = content as Record<"privacy-policy" | "terms-and-conditions" | "refund-cancellation-policy", LegalPage>;
