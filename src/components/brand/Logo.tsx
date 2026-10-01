import Image from "next/image";
import Link from "next/link";
import media from "@/data/media.json";

type Props = {
  // "plate" puts the unchanged logo on a small paper plate so the black wordmark reads on dark
  // backgrounds (spec section 7, user decision Q1). "bare" is for paper backgrounds.
  variant?: "plate" | "bare";
  height?: number;
  className?: string;
};

// The original logo file, never recoloured or redrawn.
export function Logo({ variant = "plate", height = 44, className = "" }: Props) {
  const { src, width: w, height: h } = media.logo;
  const width = Math.round((w / h) * height);
  return (
    <Link
      href="/"
      aria-label="Mould Innovation — home"
      className={`inline-flex items-center ${variant === "plate" ? "rounded-[4px] bg-paper px-2 py-1.5" : ""} ${className}`}
    >
      <Image src={src} alt="Mould Innovation" width={width} height={height} priority />
    </Link>
  );
}
