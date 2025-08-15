import React from "react";
import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import { IBlog } from "@/types/post";
import NoBlogFoundMsg from "@/app/(public pages)/blog/[slug]/components/NoBlogFoundMsg";
import EditPortfolio from "./components/EditPortfolio";

const getBlogData = async (slug: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/portfolios/${slug}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error, " Error fetching data");
  }
  return null;
};

export default async function SinglePortfolioPage({ params }) {
  const { slug } = await params;

  const data = await getBlogData(slug);
  if (!data?.portfolio) return <NoBlogFoundMsg />;
  const portfolio = data.portfolio || ({} as IBlog);
  return (
    <PrivatePageWrapper>
      <div className="w-full flex flex-col lg:px-10 gap-5 lg:gap-20">
        <EditPortfolio portfolio={portfolio} />
      </div>
    </PrivatePageWrapper>
  );
}
