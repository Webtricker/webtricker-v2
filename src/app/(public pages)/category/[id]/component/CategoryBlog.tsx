import Button from "@/sharedComponets/ui/buttons/Button";
import BlogCardWrapper from "@/sharedComponets/ui/wrapper/BlogCardWrapper";
import { IBlog } from "@/types/post";
import Link from "next/link";
import React from "react";

export default function CategoryBlog({ blogs }: { blogs: IBlog[] }) {
  if (!blogs.length)
    return (
      <div className="w-full flex items-center justify-center min-h-[200px]">
        <p className="text-center">No blog found</p>
      </div>
    );
  return (
    <div className="section-speacing w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
      {blogs.map((blog) => (
        <BlogCardWrapper
          key={blog._id}
          createdAt={new Date(blog.createdAt).toString()}
          description={blog.description}
          slug={blog.slug}
          thumnail={blog.thumnail.url}
          title={blog.title}
          excerpt={blog.excerp}
        >
          <Link href={`/blog/${blog.slug}`}>
            <Button label="Read More" className="!text-sm !py-2.5" />
          </Link>
        </BlogCardWrapper>
      ))}
    </div>
  );
}
