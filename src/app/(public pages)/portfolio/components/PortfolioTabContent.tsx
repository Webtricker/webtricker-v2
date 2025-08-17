"use client"
import { useLazyGetPortfoliosQuery } from "@/redux/features/portfolio/portfolioApi";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { ITechnology } from "@/types/data";
import { TPortfolio } from "@/types/portfolio";
import React, { useEffect, useState } from "react";
import PortfolioShowcase from "./PortfolioShowcase";

interface Props {
  selectedTechnology: ITechnology;
}
export default function PortfolioTabContent({ selectedTechnology }: Props) {
  const [loadPortfolioData, { isLoading }] = useLazyGetPortfoliosQuery();
  const [portfolios, setPortfolios] = useState<TPortfolio[]>([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await loadPortfolioData({
          technologyId: selectedTechnology._id || "",
        }).unwrap();
        if (res?.success && res?.portfolios) {
          setPortfolios(res.portfolios);
        } else {
          setPortfolios([]);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    if (selectedTechnology?._id) {
      loadData();
    }
  }, [selectedTechnology, loadPortfolioData]);

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
    <div className="w-full flex flex-col my-20 sm:my-0 gap-24 sm:gap-10">
      {portfolios.map((portfolio) => (
        <PortfolioShowcase portfolio={portfolio} key={portfolio._id} />
      ))}
    </div>
  );
}
