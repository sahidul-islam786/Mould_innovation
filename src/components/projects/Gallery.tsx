"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";
import type { Photo } from "@/data/projects";

// Project gallery with a keyboard-accessible lightbox (Esc closes, arrows move, focus returns).
export function Gallery({ title, photos }: { title: string; photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    getLenis()?.stop();
    dialog.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      getLenis()?.start();
      opener.current?.focus();
    };
  }, [open, close, move]);

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((p, i) => (
          <li key={p.src} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              className="group block w-full overflow-hidden bg-ink"
              aria-label={`Open image ${i + 1} of ${photos.length}`}
            >
              <Image
                src={p.src}
                alt={`${title} — project image ${i + 1}`}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                unoptimized={p.animated}
                loading="lazy"
                className="h-auto w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image ${open + 1} of ${photos.length}`}
          tabIndex={-1}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 outline-none"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <Image
            src={photos[open].src}
            alt={`${title} — project image ${open + 1}`}
            width={photos[open].width}
            height={photos[open].height}
            unoptimized={photos[open].animated}
            className="max-h-[85svh] w-auto max-w-full object-contain"
          />
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3 text-paper">
            <button type="button" onClick={() => move(-1)} className="min-h-11 rounded-full border border-line-dark px-5">
              Previous
            </button>
            <span className="text-sm text-muted-dark">
              {open + 1} / {photos.length}
            </span>
            <button type="button" onClick={() => move(1)} className="min-h-11 rounded-full border border-line-dark px-5">
              Next
            </button>
          </div>
          <button type="button" onClick={close} className="absolute right-4 top-4 min-h-11 rounded-full border border-line-dark px-5 text-paper">
            Close
          </button>
        </div>
      )}
    </>
  );
}
