import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import AdminBlogsContainer from "./components/AdminBlogsContainer";
import PageTitle from "../../components/PageTitle";
import Button from "@/sharedComponets/ui/buttons/Button";
import Link from "next/link";
import BlogsPageForm from "./components/BlogPageForm";

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
        <BlogsPageForm />
        <AdminBlogsContainer />
      </main>
    </PrivatePageWrapper>
  );
}
