import PageTitle from "../../components/PageTitle";
import Button from "@/sharedComponets/ui/buttons/Button";
import Link from "next/link";
import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import AdminPortfolios from "./components/AdminPortfolios";
import PortfolioPageFrom from "./components/PortfolioPageFrom";

export default function PortfoliosCustomizationPage() {
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
        <PortfolioPageFrom />
        <AdminPortfolios />
      </main>
    </PrivatePageWrapper>
  );
}
