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

const REVALIDATE_SECONDS = 60 * 60; // 1 hour

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
    <main className="w-full z-0 section-speacing mt-7 post-details-container">
      <BlogPageContainer className="section-speacing">
        <p className="">
          Published {formatDateToShortString(service.createdAt)}
        </p>
        <h1 className="page-title my-3">{service.title}</h1>
        <p className="max-w-[400px] mx-auto">{service.description}</p>
        <p className="max-w-[400px] mx-auto mt-5">
          Explore our achievements and let yourself beconvinced!
        </p>
        <ParallaxBanner src={service.thumnail.url} />
        {/* <Image
          src={service.thumnail.url}
          width={service.thumnail.width || 912}
          height={service.thumnail.height || 400}
          alt={service.title}
          className="w-full h-auto my-10"
        /> */}
        <p>{service.description}</p>
      </BlogPageContainer>
      <section className="w-full wt_parser_content">
        <BlogPageContainer>
          <HtmlContentParser htmlContent={service?.content} />
        </BlogPageContainer>
        <BlogPageContainer className="mt-10">
          <div className="w-full flex">
            {prevService && (
              <Link
                href={`/services/${prevService.slug}`}
                className="w-full relative"
              >
                <Image
                  className="object-cover h-[150px] md:h-[250px] lg:h-[300px] !rounded-e-none"
                  src={prevService?.thumnail?.url || ""}
                  width={prevService?.thumnail?.width || 456}
                  height={400}
                  title="Prev service"
                  alt={prevService.title}
                />
                <div className="hidden md:block bg-white/10 text-white backdrop-blur-md rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] font-semibold text-lg ">
                  <Button className="!py-2.5 !px-5" label="Previous Service" />
                </div>
              </Link>
            )}
            {nextService && (
              <Link
                href={`/services/${nextService.slug}`}
                className="w-full relative"
              >
                <Image
                  className="object-cover h-[150px] md:h-[250px] lg:h-[300px] !rounded-s-none"
                  src={nextService?.thumnail?.url || ""}
                  width={nextService?.thumnail?.width || 456}
                  height={400}
                  title="Next service"
                  alt={nextService.title}
                />
                <div className="hidden md:block bg-white/10 text-white backdrop-blur-md rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] font-semibold text-lg ">
                  <Button className="!py-2.5 !px-5" label="Next Service" />
                </div>
              </Link>
            )}
          </div>
        </BlogPageContainer>
      </section>
    </main>
  );
}
