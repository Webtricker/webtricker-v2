import { MetadataRoute } from "next";
import {
  getServicesData,
  getPortfoliosData,
  getCategories,
  getAllBlogSlugs,
} from "@/utils/pageData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtricker.com";

  try {
    // ==== Static Pages ====
    const staticPages: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/`, lastModified: new Date() },
      { url: `${baseUrl}/about`, lastModified: new Date() },
      { url: `${baseUrl}/blog`, lastModified: new Date() },
      { url: `${baseUrl}/contact`, lastModified: new Date() },
      { url: `${baseUrl}/services`, lastModified: new Date() },
      { url: `${baseUrl}/portfolio`, lastModified: new Date() },
      { url: `${baseUrl}/career`, lastModified: new Date() },
      { url: `${baseUrl}/training`, lastModified: new Date() },
      { url: `${baseUrl}/privacy-policy`, lastModified: new Date() },
      { url: `${baseUrl}/terms-and-conditions`, lastModified: new Date() },
    ];

    // ==== Static: Training detail pages (hardcoded IDs 1-9) ====
    const trainingPages: MetadataRoute.Sitemap = Array.from(
      { length: 9 },
      (_, i) => ({ url: `${baseUrl}/training/${i + 1}`, lastModified: new Date() })
    );

    // ==== Dynamic: Services ====
    const servicesData = (await getServicesData()) || [];
    const servicePages: MetadataRoute.Sitemap = servicesData.map(
      (service: { slug: string }) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    );

    // ==== Dynamic: Portfolios ====
    const portfolioData = (await getPortfoliosData(999)) || [];
    const portfolioPages: MetadataRoute.Sitemap = portfolioData.map(
      (portfolio: { slug: string }) => ({
        url: `${baseUrl}/portfolio/${portfolio.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    );

    // ==== Dynamic: Categories ====
    const categories = (await getCategories()) || [];
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/category/${category._id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // ==== Dynamic: Blog posts ====
    const blogs = (await getAllBlogSlugs()) || [];
    const blogPages: MetadataRoute.Sitemap = blogs.map(
      (blog: { slug: string }) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    return [
      ...staticPages,
      ...trainingPages,
      ...servicePages,
      ...portfolioPages,
      ...categoryPages,
      ...blogPages,
    ];
  } catch (err) {
    console.error("Error generating sitemap:", err);
    return [{ url: baseUrl, lastModified: new Date() }];
  }
}
