import { TCategory } from "@/types/data";
import { IBlog } from "@/types/post";

export const getTeamData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teams`);

    if (!res.ok) {
      console.error("Failed to fetch team data");
      return [];
    }
    const result = await res.json();
    return result?.teamData || [];
  } catch (error) {
    console.error("Error fetching team data:", error);
    return [];
  }
};

export const getContactPageData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/contact-page`
    );

    if (!res.ok) {
      console.error("Failed to fetch contact page data");
      return [];
    }
    const result = await res.json();
    return result?.data || [];
  } catch (error) {
    console.error("Error fetching contact page data", error);
    return [];
  }
};

export const getAllBlogSlugs = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog-slugs`
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

export const getCategories = async (): Promise<TCategory[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`
    );

    if (!res.ok) {
      console.error("Failed to fetch categories (Server)");
      return [];
    }
    const result = await res.json();
    return result?.categories || [];
  } catch (error) {
    console.error("Error fetching categories (Server):", error);
    return [];
  }
};

export const getTestimonialsData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials`
    );

    if (!res.ok) {
      console.error("Failed to fetch testimonial data");
      return [];
    }
    const result = await res.json();
    return result?.testimonialsData || [];
  } catch (error) {
    console.error("Error fetching testimonial data:", error);
    return [];
  }
};

export const getPortfoliosData = async (limit = 6) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolios?limit=${limit}`
    );

    if (!res.ok) {
      console.error("Failed to fetch portfolios data");
      return [];
    }
    const result = await res.json();
    return result?.portfolios || [];
  } catch (error) {
    console.error("Error fetching portfolios data:", error);
    return [];
  }
};

export const getTechnologies = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolio-technologies`
    );

    if (!res.ok) {
      console.error("Failed to fetch portfolios data");
      return [];
    }
    const result = await res.json();
    return result?.technologies || [];
  } catch (error) {
    console.error("Error fetching portfolios data:", error);
    return [];
  }
};

export const getServicesData = async (limit: number = 99) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/services?limit=${limit}`
    );

    if (!res.ok) {
      console.error("Failed to fetch services");
      return [];
    }
    const result = await res.json();
    return result?.services || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const getServicesPageData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/services-page`
    );

    if (!res.ok) {
      console.error("Failed to fetch services");
      return [];
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const getPostsData = async (
  limit: number = 99
): Promise<IBlog[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?limit=${limit}`
    );

    if (!res.ok) {
      console.error(`Failed to fetch posts . Status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data?.posts || [];
  } catch (error) {
    console.error(`Error fetching posts`, error);
    return null;
  }
};

export const getHomePageData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/home-page`
    );
    if (!res.ok) {
      console.error("Failed to fetch home page data");
      return {};
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return {};
  }
};

export const getAboutPageData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/about-page`
    );
    if (!res.ok) {
      console.error("Failed to fetch about page data");
      return {};
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching about page data:", error);
    return {};
  }
};

export const getLeaderData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leader`);

    if (!res.ok) {
      console.error("Failed to fetch leader data");
      return [];
    }
    const result = await res.json();
    return result?.leaderData || [];
  } catch (error) {
    console.error("Error fetching leader data:", error);
    return [];
  }
};

export const getPortfolioPageData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolios-page`
    );
    if (!res.ok) {
      console.error("Failed to fetch portfolio page data");
      return {};
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching portfolio page data:", error);
    return {};
  }
};

export const getBlogsPageData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs-page`
    );
    if (!res.ok) {
      console.error("Failed to fetch blogs page data");
      return {};
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching blogs page data:", error);
    return {};
  }
};

export const getPublicFooterData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/footer`);
    if (!res.ok) {
      console.error("Failed to fetch footer data");
      return {};
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return {};
  }
};

export const getTobBarInfo = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/top-header`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;
    const result = await res.json();

    if (!result || !result?.data) return null;
    return result.data;
  } catch (error) {
    console.log("Error fetching top bar information ", error);
    return null;
  }
};

export const getMainHeaderData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/main-header`
    );
    if (!res.ok) {
      console.error("Failed to fetch header data");
      return {};
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching header data:", error);
    return {};
  }
};

export const getSidebarData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sidebar`);
    if (!res.ok) {
      console.error("Failed to fetch header data");
      return {};
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching header data:", error);
    return {};
  }
};

export const getPortfolioTechnology = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolio-technologies/${id}`);
    if (!res.ok) {
      console.error("Failed to fetch header data");
      return {};
    }
    const result = await res.json();
    return result?.technology || {};
  } catch (error) {
    console.error("Error fetching header data:", error);
    return {};
  }
};

export const getTermsAndConditionPageData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/terms-and-conditions`);
    if (!res.ok) {
      console.error("Failed to fetch terms and condition data");
      return {};
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching terms and condition data:", error);
    return {};
  }
};

export const getPrivacyPolicyPageData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/privacy-policy-page`);
    if (!res.ok) {
      console.error("Failed to fetch privacy policy page data");
      return {};
    }
    const result = await res.json();
    return result?.data || {};
  } catch (error) {
    console.error("Error fetching privacy policy page data:", error);
    return {};
  }
};
