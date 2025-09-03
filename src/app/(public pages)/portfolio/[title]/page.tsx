// import { TPortfolio } from '@/types/portfolio';
import React from 'react'



// const REVALIDATE_SECONDS = 60 * 60;

// Helper function to fetch a single service data
// export const getPortfolioData = async (slug: string) => {
//     try {
//         const res = await fetch(
//             `${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolios/${slug}`,
//             {
//                 next: { revalidate: REVALIDATE_SECONDS }, // ISG Revalidation for this specific service
//             }
//         );
//         if (!res.ok) {
//             console.error(
//                 `Failed to fetch portfolio data for slug: ${slug}, Status: ${res.status}`
//             );
//             return null;
//         }
//         const data = await res.json();
//         return data;
//     } catch (error) {
//         console.error("Error fetching portfolio data:", error);
//         return null;
//     }
// };


// Helper function to fetch all service slugs for generateStaticParams
// const getAllPortfolioSlugs = async () => {
//     try {
//         const res = await fetch(
//             `${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolios?limit=999`,
//             {
//                 cache: "no-store",
//             }
//         );

//         if (!res.ok) {
//             console.error(`Failed to fetch all porfolio slugs, Status: ${res.status}`);
//             return [];
//         }
//         const { portfolios } = await res.json();
//         return portfolios.map((portfolio: TPortfolio) => ({ slug: portfolio.slug }));
//     } catch (error) {
//         console.error("Error fetching all portfolio slugs:", error);
//         return [];
//     }
// };


// generateStaticParams tells Next.js which slugs to pre-render at build time
// export async function generateStaticParams() {
//     const slugs = await getAllPortfolioSlugs();
//     return slugs;
// }


// ===== root page component =======
export default async function PortfolioDetailsPage({
    params,
}: {
    params: Promise<{ title: string }>;
}) {
    const { title } = await params;
    console.log(title, '  title')
    return (
        <main className="w-full z-0"></main>
    )
}
