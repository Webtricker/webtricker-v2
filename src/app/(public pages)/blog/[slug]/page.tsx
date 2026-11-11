import DetailStudio from "@/studio/pages/DetailStudio";
import { fmtDate as studioFmtDate } from "@/studio/ui";
// app/blog/[slug]/page.tsx
import React from "react";
import NoBlogFoundMsg from "./components/NoBlogFoundMsg"; // Ensure this path is correct
import HtmlContentParser from "@/sharedComponets/ui/editor/HtmlContentParser";
import { formatDateToShortString } from "@/utils/date";
import BlogPageContainer from "@/sharedComponets/ui/wrapper/BlogPageContainer";
import { IBlog } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";

// const REVALIDATE_SECONDS = 60 * 60; // 3600 seconds = 1 hour
// TEMP: revalidate=0 for active dev — RESET before launch (was: 10 * 60)
const REVALIDATE_SECONDS = 300;
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA || "dev").slice(0, 7);

const getBlogData = async (slug: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}?b=${BUILD}`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch blog data for slug: ${slug}, Status: ${res.status}`
      );
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog data:", error);
  }
  return null;
};

const getAllBlogSlugs = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog-slugs`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch all blog slugs for generateStaticParams");
      return [];
    }
    const { blogs } = await res.json();
    return blogs.map((blog: { slug: string }) => ({ slug: blog.slug }));
  } catch (error) {
    console.error("Error fetching all blog slugs:", error);
    return [];
  }
};

// generateStaticParams tells Next.js which slugs to pre-render at build time
export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs;
}

// generate metadata for each blog post dynamically
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBlogData(slug);

  if (!data?.post) {
    return {
      title: "Blog Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  const post = data.post as IBlog;
  return {
    title: `${post.title}`,
    description: post.description,
    keywords: [post?.category?.name || 'Article'],
    authors: [{ name: "Webtricker Team" }],
    openGraph: {
      type: "article",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
      title: post.title,
      description: post.description,
      images: [
        {
          url: post.thumnail.url,
          width: post.thumnail?.width || 1200,
          height: post.thumnail?.height || 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@webtricker",
      title: post.title,
      description: post.description,
      images: [post.thumnail.url],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`,
    },
  };
}


// Main component for the single blog page
export default async function SingleBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getBlogData(slug);
  if (!data?.post) {
    return <NoBlogFoundMsg msg="No blog post found" />;
  }

  const nextPost = data.nextPost;
  const prevPost = data.prevPost;
  const post = data.post as IBlog;
  const siteUrl = "https://webtricker.com";
  const postUrl = `${siteUrl}/blog/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        mainEntityOfPage: postUrl,
        headline: post.title,
        description: post.description,
        image: post.thumnail?.url ? [post.thumnail.url] : undefined,
        datePublished: new Date(post.createdAt).toISOString(),
        dateModified: new Date((post as IBlog & { updatedAt?: Date }).updatedAt ?? post.createdAt).toISOString(),
        articleSection: post.category?.name,
        inLanguage: "en-US",
        author: { "@type": "Organization", name: "Webtricker", url: siteUrl },
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      },
    ],
  };
  return (
    <DetailStudio
      kind="Blog"
      listHref="/blog"
      title={post.title}
      meta={`${post.category?.name || "Article"} · Published ${studioFmtDate(post.createdAt)}`}
      category={post.category?.name}
      tags={(post as any).readingTime ? [`${(post as any).readingTime} min read`] : []}
      cover={post.thumnail?.url}
      description={post.description}
      html={post.content}
      prev={prevPost ? { href: `/blog/${prevPost.slug}`, title: prevPost.title } : null}
      next={nextPost ? { href: `/blog/${nextPost.slug}`, title: nextPost.title } : null}
      schema={schema}
    />
  );
}
