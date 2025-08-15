import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import PageTitle from "../../components/PageTitle";
import AddTechnologyModal from "./components/AddTechnologyModal";
import Technologies from "./components/Technologies";
import AddTechnologyBtn from "./components/AddTechnologyBtn";

export default function PortfolioTechnologyCustomizationPage() {
  return (
    <PrivatePageWrapper className="!p-0">
      <main className="w-full z-0">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle
            key="Portfolio Technologies"
            title="Portfolio Technologies"
          />
          <AddTechnologyBtn />
        </section>
        <section
          className={`w-full min-h-[70vh] px-4 z-0 flex flex-col items-center relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18 pt-20`}
        >
          <Technologies />
        </section>
        <AddTechnologyModal />
      </main>
    </PrivatePageWrapper>
  );
}
