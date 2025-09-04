import { MetadataRoute } from "next";
import { getServicesData, getPortfolioPageData, getCategories, getAllBlogSlugs } from "@/utils/pageData";
// ⬆️ replace with your actual data fetching functions

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
    ];

    console.log(staticPages, ' static pages')

    // ==== Dynamic: Services ====
    const servicesData = (await getServicesData()) || [];
    const servicePages: MetadataRoute.Sitemap = servicesData.map((service: { slug: string }) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    console.log(servicesData, 'servicesData')
    console.log(servicePages, 'servicePages')

    // ==== Dynamic: Portfolios ====
    const portfolioData = (await getPortfolioPageData()) || [];
    const portfolioPages: MetadataRoute.Sitemap = portfolioData.map((portfolio: { slug: string }) => ({
      url: `${baseUrl}/portfolio/${portfolio.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    console.log(portfolioData, 'portfolioData')
    console.log(portfolioPages, 'portfolioPages')

    // ==== Dynamic: Category ========
    const categories = (await getCategories()) || [];
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/portfolio/${category._id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));



    console.log(categories, 'categories')
    console.log(categoryPages, 'categoryPages')

    // ==== Dynamic: Blogs ====
    const blogs = (await getAllBlogSlugs()) || [];
    const blogPages: MetadataRoute.Sitemap = blogs.map((blog: { slug: string }) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));


    console.log(blogs, 'blogs')
    console.log(blogPages, 'blogPages')


    // Return all together
    return [...staticPages, ...servicePages, ...portfolioPages, ...categoryPages, ...blogPages];
  } catch (err) {
    console.error("❌ Error generating sitemap:", err);
    return [{ url: baseUrl, lastModified: new Date() }]; // fallback
  }
}
