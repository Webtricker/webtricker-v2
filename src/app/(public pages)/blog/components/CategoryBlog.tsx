import Button from "@/sharedComponets/ui/buttons/Button";
import BlogCardWrapper from "@/sharedComponets/ui/wrapper/BlogCardWrapper";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { TCategory } from "@/types/data";
import { IBlog } from "@/types/post";
import Link from "next/link";
import React from "react";

const POSTS_REVALIDATE_SECONDS = 60 * 2; // 30 minutes

const getPostsForCategory = async (
  categoryId: string
): Promise<IBlog[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?categoryId=${categoryId}&limit=5`,
      {
        next: { revalidate: POSTS_REVALIDATE_SECONDS },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch posts for category ID: ${categoryId}. Status: ${res.status}`
      );
      return null;
    }

    const data = await res.json();
    return data?.posts || [];
  } catch (error) {
    console.error(
      `Error fetching posts for category ID: ${categoryId}:`,
      error
    );
    return null;
  }
};

export default async function CategoryBlog({
  category,
}: {
  category: TCategory;
}) {
  console.log("render info Category blog");

  const posts = await getPostsForCategory(category._id);
  if (!posts || posts.length === 0) {
    return <></>;
  }

  return (
    <Container className="section-speacing">
      <div className="w-full flex items-center justify-between gap-4 flex-wrap lg:gap-10">
        <h4>{category.name}</h4>

        {posts.length > 4 ? (
          <Link href={`/category/${category._id}`}>
            <Button label="Show All" className="!py-2.5 lg:!py-3" />
          </Link>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
        {posts.slice(0, 4).map((blog: IBlog) => (
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
    </Container>
  );
}
