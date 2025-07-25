import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import Container from "@/sharedComponets/ui/wrapper/Container";
import AdminBlogsContainer from "./components/AdminBlogsContainer";
import PageTitle from "../../components/PageTitle";
import Button from "@/sharedComponets/ui/buttons/Button";
import Link from "next/link";

export default function BlogsPage() {
  return (
    <PrivatePageWrapper className="!p-0">
      <main className="w-full z-0">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle key="BLOGS" title="Blogs" />
          <Link href="/settings/blogs/add">
            <Button className="!py-2.5 whitespace-nowrap" label="Add Blog" />
          </Link>
        </section>
        <section
          className={`w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}
        >
          <Container className="flex items-center justify-center">
            <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
              <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
                Our Blog
              </h1>
              <p className="!text-white wt_text-shadow wt_fs-xl bold mt-5">
                Experience the synergy of design and technology. As a
                full-service digital partner, we bring your brand to life
                through transformative digital solutions and captivating
                experiences
              </p>
            </div>
          </Container>
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            src="/videos/blogs/blog.mp4"
          >
            <source src="/videos/blogs/blog.mp4" type="video/mp4" />
          </video>
        </section>
        <AdminBlogsContainer />
      </main>
    </PrivatePageWrapper>
  );
}
