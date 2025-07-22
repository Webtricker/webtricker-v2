import React from "react";
import NoBlogFoundMsg from "./components/NoBlogFoundMsg";
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import { formatDateToShortString } from "@/utils/date";
import BlogPageContainer from "@/sharedComponets/ui/wrapper/BlogPageContainer";
import { IBlog } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";

const getBlogData = async (slug: string) => {
  // You can fetch data here on the server f
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
  const nextPost = data.nextPost || ({} as IBlog);
  const prevPost = data.prevPost || ({} as IBlog);
  
  const post = data.post || ({} as IBlog);
  return (
    <main className="w-full z-0 section-speacing mt-7 post-details-container">
      <BlogPageContainer className="section-speacing">
        <p className="text-center">
          Published {formatDateToShortString(post.createdAt)}
        </p>
        <h1 className="wt_fs-5xl text-center my-3">{post.title}</h1>
        <Image
          src={post.thumnail.url}
          width={post.thumnail.width || 912}
          height={post.thumnail.height || 400}
          alt={post.title}
          className="w-full h-auto my-10"
        />
        <p>{post.description}</p>
      </BlogPageContainer>
      <section className="w-full wt_parser_content">
        <BlogPageContainer>
          <HtmlContentParser htmlContent={post?.content} />
        </BlogPageContainer>
        <BlogPageContainer className="mt-10">
          <div className="w-full flex">
            {
              prevPost && (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="w-full relative"
                >
                  <Image className="object-cover h-[150px] md:h-[250px] lg:h-[300px] !rounded-e-none" src={prevPost?.thumnail?.url || ''} width={prevPost?.thumnail?.width || 456}  height={400} title="Prev post" alt={prevPost.title} />
                  <div className="hidden md:block bg-white/10 text-white backdrop-blur-md rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] font-semibold text-lg ">
                    <Button className="!py-2.5 !px-5" label="Previous Blog" />
                  </div>
                  
                </Link>
              )
            }
            {
              nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="w-full relative"
                  >
                  <Image className="object-cover h-[150px] md:h-[250px] lg:h-[300px] !rounded-s-none" src={nextPost?.thumnail?.url || ''} width={nextPost?.thumnail?.width || 456}  height={400} title="Prev post" alt={nextPost.title} />
                  <div className="hidden md:block bg-white/10 text-white backdrop-blur-md rounded-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] font-semibold text-lg ">
                    <Button className="!py-2.5 !px-5" label="Next Blog" />
                  </div>
                </Link>
              )
            }
          </div>
        </BlogPageContainer>
      </section>
    </main>
  );
}
