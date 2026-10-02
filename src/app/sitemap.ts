import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { jobs } from "@/data/careers";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about/",
    "/services/",
    ...services.map((s) => `/services/${s.slug}/`),
    "/projects/",
    ...projects.map((p) => `/projects/${p.slug}/`),
    "/saas/",
    "/careers/",
    ...jobs.map((j) => `/careers/${j.slug}/`),
    "/contact/",
    "/privacy-policy/",
    "/terms-and-conditions/",
    "/refund-cancellation-policy/",
  ];
  return paths.map((p) => ({ url: `${company.siteUrl}${p}` }));
}
