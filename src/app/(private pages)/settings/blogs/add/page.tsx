import React from "react";
import BlogPageEditor from "./components/BlogPageEditor";
import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";

export default function AddBlogPage() {
  return (
    <PrivatePageWrapper>
      <div className="w-full flex flex-col lg:px-10 gap-5 lg:gap-20">
          <BlogPageEditor />
      </div>
    </PrivatePageWrapper>
  );
}