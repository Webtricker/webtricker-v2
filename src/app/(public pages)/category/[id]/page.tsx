import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import CategoryBlogsContainer from "./component/CategoryBlogsContainer";
import shortLogo from "@/assets/images/home/webtricker-w.png";

// get category related posts data
async function getCategoryPosts(id: string) {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}`).then(
    (res) => res.json()
  );
}

export const revalidate = 120;

// generate dynamic metadata for each category page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data = await getCategoryPosts(id);

  if (!data.success) return { title: "Invalid category" };
  const categoryName = data?.category?.name;

  return {
    title: `${categoryName}`,
    description: `Explore our blog posts about ${categoryName}.`,
    keywords: [categoryName, "Webtricker blog", "web design", "web development"],

    openGraph: {
      type: "article",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`,
      title: `${categoryName} | Webtricker`,
      description: `Explore our blog posts about ${categoryName}.`,
      images: [
        {
          url: `${shortLogo.src}`,
          width: 1200,
          height: 630,
          alt: `Webtricker - Blog posts about ${categoryName}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@webtricker",
      title: `${categoryName} | Webtricker`,
      description: `Explore our blog posts about ${categoryName}.`,
      images: [shortLogo.src],
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`,
    },

    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    category: "technology",
  };
}

// Define the type for the props explicitly
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data = await getCategoryPosts(id);

  if (!data.success)
    return (
      <Container>
        <h1 className="text-center">Invalid category</h1>
      </Container>
    );
  return (
    <main className="w-full z-0">
      <section
        className={`w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}
      >
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              {data.category?.name}
            </h1>
            <p className="!text-white wt_text-shadow wt_fs-xl bold mt-5">
              Explore our blog posts about {data.category?.name}.
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
      <CategoryBlogsContainer categoryId={data.category?._id} />
    </main>
  );
}
