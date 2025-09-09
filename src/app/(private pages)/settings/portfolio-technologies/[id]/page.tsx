
import PageTitle from "@/app/(private pages)/components/PageTitle";
import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import Button from "@/sharedComponets/ui/buttons/Button";
import Link from "next/link";
import React from "react";
import AdminCategoryPortfolio from "../../portfolios/components/AdminCategoryPortfolio";
import { getPortfolioTechnology } from "@/utils/pageData";
import { ITechnology } from "@/types/data";

export default async function TechnologyPortfolios({ params }) {
  const { id } = await params;

  const technology = await getPortfolioTechnology(id) as ITechnology;

  return (
    <PrivatePageWrapper className="!p-0">
      <main className="w-full z-0">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle key="Portfolios" title="Portfolios" />
          <Link href="/settings/portfolios/add">
            <Button
              className="!py-2.5 whitespace-nowrap"
              label="Add Portfolio"
            />
          </Link>
        </section>
        <AdminCategoryPortfolio
          limit={99}
          key={technology?._id || id}
          technology={technology || { _id: id, name: "" }}
        />
      </main>
    </PrivatePageWrapper>
  );
}
