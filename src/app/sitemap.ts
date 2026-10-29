import { MetadataRoute } from "next";
import {
  getServicesData,
  getPortfoliosData,
  getCategories,
  getAllBlogSlugs,
} from "@/utils/pageData";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtricker.com";

  try {
    // ==== Static Pages ====
    const staticPages: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/` },
      { url: `${baseUrl}/about` },
      { url: `${baseUrl}/blog` },
      { url: `${baseUrl}/contact` },
      { url: `${baseUrl}/free-consultation`, priority: 0.9 },
      { url: `${baseUrl}/services` },
      { url: `${baseUrl}/portfolio` },
      { url: `${baseUrl}/career` },
      { url: `${baseUrl}/training` },
      { url: `${baseUrl}/privacy-policy` },
      { url: `${baseUrl}/terms-and-conditions` },
    ];

    // ==== Dynamic: Training courses (published slugs only) ====
    const trainingRes = await fetch(
      `${baseUrl}/api/training?published=true&limit=100`,
      { cache: "no-store" }
    );
    const trainingData = trainingRes.ok ? await trainingRes.json() : { courses: [] };
    const trainingPages: MetadataRoute.Sitemap = (trainingData.courses || []).map(
      (course: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/training/${encodeURIComponent(course.slug)}`,
        ...(course.updatedAt && { lastModified: new Date(course.updatedAt) }),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })
    );

    // ==== Dynamic: Services ====
    const servicesData = (await getServicesData()) || [];
    const servicePages: MetadataRoute.Sitemap = servicesData.map(
      (service: { slug: string }) => ({
        url: `${baseUrl}/services/${encodeURIComponent(service.slug)}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    );

    // ==== Dynamic: Portfolios ====
    const portfolioData = (await getPortfoliosData(999)) || [];
    const portfolioPages: MetadataRoute.Sitemap = portfolioData.map(
      (portfolio: { slug: string }) => ({
        url: `${baseUrl}/portfolio/${encodeURIComponent(portfolio.slug)}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    );

    // ==== Dynamic: Categories ====
    const categories = (await getCategories()) || [];
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/category/${category._id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // ==== Dynamic: Blog posts ====
    const blogs = (await getAllBlogSlugs()) || [];
    const blogPages: MetadataRoute.Sitemap = blogs.map(
      (blog: { slug: string }) => ({
        url: `${baseUrl}/blog/${encodeURIComponent(blog.slug)}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    // ==== Dynamic: Career listings ====
    const careerRes = await fetch(`${baseUrl}/api/career?published=true&limit=100`, {
      cache: "no-store",
    });
    const careerData = careerRes.ok ? await careerRes.json() : { careers: [] };
    const careerPages: MetadataRoute.Sitemap = (careerData.careers || []).map(
      (career: { slug: string; updatedAt?: string }) => ({
        url: `${baseUrl}/career/${encodeURIComponent(career.slug)}`,
        ...(career.updatedAt && { lastModified: new Date(career.updatedAt) }),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    );

    return [
      ...staticPages,
      ...trainingPages,
      ...servicePages,
      ...portfolioPages,
      ...categoryPages,
      ...blogPages,
      ...careerPages,
    ];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return [{ url: baseUrl }];
  }
}
