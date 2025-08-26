import PageTitle from "../../components/PageTitle";
import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import TopHeaderForm from "./components/TopHeaderForm";

export default function HeaderCustomizationPage() {
  return (
    <PrivatePageWrapper className="!p-0">
      <main className="w-full z-0">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle key="Header" title="Header Customization" />
        </section>
        <TopHeaderForm />
      </main>
    </PrivatePageWrapper>
  );
}
