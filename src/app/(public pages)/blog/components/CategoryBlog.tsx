"use client";
import { useGetPostsQuery } from "@/redux/features/post/postApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import BlogCardWrapper from "@/sharedComponets/ui/wrapper/BlogCardWrapper";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { TCategory } from "@/types/data";
import { IBlog } from "@/types/post";
import Link from "next/link";
import React from "react";

export default function CategoryBlog({ category }: { category: TCategory }) {
  const { data, isLoading, isError, error } = useGetPostsQuery({
    postType: "blog",
    categoryId: category._id,
    limit: 9,
  });

  if (isLoading) {
    return (
      <Container className="section-speacing flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </Container>
    );
  }

  if (!data || !data?.posts?.length || isError) {
    console.log(error);
    return <></>;
  }

  return (
    <Container className="section-speacing">
      <div className="w-full flex items-center justify-between gap-4 flex-wrap lg:gap-10">
        <h4>{category.name}</h4>

        {data.posts?.length > 8 ? (
          <Link href={`/category/${category._id}`}>
            <Button label="Show All" className="!py-2.5 lg:!py-3" />
          </Link>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
        {data.posts.slice(0, 8).map((blog:IBlog) => (
          <BlogCardWrapper
            key={`${blog._id}-${category}`}
            createdAt={blog.createdAt}
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
    </Container>
  );
}
