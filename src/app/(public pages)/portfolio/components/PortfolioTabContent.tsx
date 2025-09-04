"use client"
import { useLazyGetPortfoliosQuery } from "@/redux/features/portfolio/portfolioApi";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { ITechnology } from "@/types/data";
import { TPortfolio } from "@/types/portfolio";
import React, { useEffect, useState } from "react";
import PortfolioShowcase from "./PortfolioShowcase";
import Pagination from "@/sharedComponets/ui/pagination/Pagination";

const limit = 6;
interface Props {
  selectedTechnology: ITechnology | null;
}
export default function PortfolioTabContent({ selectedTechnology }: Props) {
  const [loadPortfolioData, { isLoading }] = useLazyGetPortfoliosQuery();
  const [portfolios, setPortfolios] = useState<TPortfolio[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await loadPortfolioData({
          technologyId: selectedTechnology?._id || "",
          limit,
          page: currentPage,

        }).unwrap();
        if (res?.success && res?.portfolios) {
          setPortfolios(res.portfolios);
          if (res?.pagination?.total) {
            const pages = Math.ceil(res?.pagination?.total / limit) || 1
            setTotalPages(pages);
          }
          console.log(res, ' res from total pages');
        } else {
          setPortfolios([]);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    loadData();
  }, [selectedTechnology, currentPage, loadPortfolioData]);

  if (isLoading)
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!portfolios.length)
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <p>No portfolio found for this technology</p>
      </div>
    );
  return (
    <div className="w-full">
      <div className="w-full flex flex-col my-20 sm:my-0 gap-24 sm:gap-10">
        {portfolios.map((portfolio) => (
          <PortfolioShowcase portfolio={portfolio} key={portfolio._id} />
        ))}
      </div>

      {
        totalPages > 1 && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} containerStyle="mb-10 lg:mb-20" />
      }


    </div>
  );
}
