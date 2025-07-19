import React from "react";
import NoBlogFoundMsg from "./components/NoBlogFoundMsg";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import { formatDateToShortString } from "@/utils/date";
import BlogPageContainer from "@/sharedComponets/ui/wrapper/BlogPageContainer";
import { IBlog } from "@/types/post";

const getBlogData = async (slug: string) => {
  // You can fetch data here on the server
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error, " Error fetching data");
  }
  return null;
};

export default async function SingleBlogPage({ params }) {
  const { slug } = await params;

  const data = await getBlogData(slug);
  if (!data?.post) return <NoBlogFoundMsg />;
  const post = data.post || ({} as IBlog);
  return (
    <main className="w-full z-0 section-speacing mt-7 post-details-container">
      <BlogPageContainer className="section-speacing">
        <p className="text-center">
          Published {formatDateToShortString(post.createdAt)}
        </p>
        <h1 className="wt_fs-5xl text-center my-3">{post.title}</h1>
        <p>{post.description}</p>
      </BlogPageContainer>
      <section className="w-full wt_parser_content">
        <BlogPageContainer>
          <HtmlContentParser htmlContent={post?.content} />
        </BlogPageContainer>
      </section>
    </main>
  );
}
