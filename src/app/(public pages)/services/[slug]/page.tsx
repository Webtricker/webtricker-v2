import DetailStudio from "@/studio/pages/DetailStudio";
import { fmtDate as studioFmtDate } from "@/studio/ui";
import React from "react";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import { formatDateToShortString } from "@/utils/date";
import BlogPageContainer from "@/sharedComponets/ui/wrapper/BlogPageContainer";
import { IService } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";
import NoBlogFoundMsg from "../../blog/[slug]/components/NoBlogFoundMsg";
import ParallaxBanner from "./components/ServiceBanner";

// const REVALIDATE_SECONDS = 60 * 60;
// TEMP: revalidate=0 for active dev — RESET before launch (was: 10 * 60)
const REVALIDATE_SECONDS = 86400;

// Helper function to fetch a single service data
const getServiceData = async (slug: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${slug}`,
      {
        next: { revalidate: REVALIDATE_SECONDS }, // ISG Revalidation for this specific service
      }
    );
    if (!res.ok) {
      console.error(
        `Failed to fetch service data for slug: ${slug}, Status: ${res.status}`
      );
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching service data:", error);
    return null;
  }
};

// Helper function to fetch all service slugs for generateStaticParams
const getAllServiceSlugs = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/services`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch all service slugs, Status: ${res.status}`);
      return [];
    }
    const { services } = await res.json();
    return services.map((service: IService) => ({ slug: service.slug }));
  } catch (error) {
    console.error("Error fetching all service slugs:", error);
    return [];
  }
};

// generateStaticParams tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs;
}

// dynamically generating metadata for each service page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getServiceData(slug);

  if (!data?.service) {
    return {
      title: "Service Not Found",
      description: "The service you are looking for does not exist.",
    };
  }

  const service = data.service as IService;

  const metaTitle = `${service.title} | Services`;
  const metaDescription =
    service.description ||
    `Learn more about our ${service.title} service at Webtricker.`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      service.title,
      "Webtricker services",
      "web design",
      "web development",
      "SEO",
      "digital agency",
    ],
    openGraph: {
      type: "article",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/services/${service.slug}`,
      siteName: "Webtricker",
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: service.thumnail?.url || "/default-service-image.png",
          width: service.thumnail?.width || 1200,
          height: service.thumnail?.height || 630,
          alt: service.title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@webtricker",
      title: metaTitle,
      description: metaDescription,
      images: [service.thumnail?.url || "/default-service-image.png"],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/services/${service.slug}`,
    },
    category: "technology",
    authors: [{ name: "Webtricker Team", url: "https://webtricker.com" }],
    publisher: "Webtricker",
  };
}

export default async function SingleServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getServiceData(slug);

  if (!data?.service) {
    // This will render a 404 page in production if not found or an error occurred
    return <NoBlogFoundMsg key="SERVICE_NOT_FOUND" msg="No service found" />;
  }

  const nextService = data.nextService;
  const prevService = data.prevService;
  const service = data.service as IService;

  return (
    <DetailStudio
      kind="Service"
      listHref="/services"
      title={service.title}
      meta={`Published ${studioFmtDate(service.createdAt)}`}
      category={service.category}
      cover={service.thumnail?.url}
      description={service.description}
      html={service.content}
      prev={prevService ? { href: `/services/${prevService.slug}`, title: prevService.title } : null}
      next={nextService ? { href: `/services/${nextService.slug}`, title: nextService.title } : null}
    />
  );
}
