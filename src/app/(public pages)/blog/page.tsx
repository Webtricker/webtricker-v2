import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import BlogCardsContainer from "./components/BlogCardsContainer";
import { Metadata } from "next";
import { getBlogsPageData } from "@/utils/pageData";
import { IBlogPage } from "@/types/pageTypes";
import Image from "next/image";

export const metadata: Metadata = {
  title: "webtricker | Explore Our Blog: Ideas and Inspiration",
  description:
    "Read our blogs: Insights on responsive web design, UI/UX design, and website optimization.",
};

export default async function BlogPage() {
  const pageDate = (await getBlogsPageData()) as IBlogPage;
  return (
    <main className="w-full z-0">
      <section
        className={`w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}
      >
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              {pageDate?.title}
            </h1>
            <p className="!text-white wt_text-shadow wt_fs-xl bold mt-5">
              {pageDate?.description}
            </p>
          </div>
        </Container>
        {pageDate?.bannerBG?.type === "image" ? (
          <Image
            title="Click to change background"
            width={1800}
            height={900}
            src={pageDate?.bannerBG?.src || ""}
            className=" absolute top-0 left-0 w-full h-full object-cover -z-10"
            alt="Service Banner Image"
          />
        ) : (
          <video
            title="Click to change background"
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            src={pageDate?.bannerBG?.src || ""}
          >
            <source src={pageDate?.bannerBG?.src || ""} type="video/mp4" />
          </video>
        )}
      </section>
      <BlogCardsContainer />
    </main>
  );
}
