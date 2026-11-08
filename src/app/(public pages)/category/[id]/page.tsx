import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import Link from "next/link";
import shortLogo from "@/assets/images/home/webtricker-w.png";
import { getPostsData } from "@/utils/pageData";
import { PageHead, nameOf } from "@/studio/parts";
import { Arrow, fmtDate, stripHtml } from "@/studio/ui";

/* eslint-disable @next/next/no-img-element */

// get category related posts data
async function getCategoryPosts(id: string) {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}`).then(
    (res) => res.json()
  );
}

// TEMP: revalidate=0 for active dev — RESET before launch (was: 120)
export const revalidate = 86400;

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
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/category/${id}`,
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
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/category/${id}`,
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
  const catName = data.category?.name;
  const posts = ((await getPostsData(999)) as any[]).filter((p) => p?.slug && [nameOf(p.category), p.category?._id, p.category].includes(catName) || [p.category?._id, p.category].includes(id));
  return (
    <main className="page" data-page="journal">
      <PageHead video="blog" crumb="Blog · Category" title={catName} lead={`Explore our blog posts about ${catName}.`} />
      <section className="chapter">
        <div className="wrap">
          {posts.length ? (
            <div className="posts">
              {posts.map((p) => (
                <Link className="post" href={`/blog/${p.slug}`} key={p._id || p.slug}>
                  <div className="media">
                    <img src={p.thumnail?.url} alt={p.title} loading="lazy" />
                  </div>
                  <div className="post__meta">
                    <span className="mono" style={{ color: "var(--amber)" }}>{catName}</span>
                    <span className="mono mute">{fmtDate(p.createdAt)}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.excerp || stripHtml(p.description)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="lead">No posts in this category yet.</p>
          )}
          <div style={{ marginTop: 56 }}>
            <Link className="textlink" href="/blog">
              All posts <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
