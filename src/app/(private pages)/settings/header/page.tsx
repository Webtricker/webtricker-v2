import PageTitle from "../../components/PageTitle";
import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import TopHeaderForm from "./components/TopHeaderForm";
import Container from "@/sharedComponets/ui/wrapper/Container";

export default function HeaderCustomizationPage() {
  return (
    <PrivatePageWrapper className="!p-0 flex flex-col min-h-screen">
      <main className="w-full h-full z-0 flex flex-col grow">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle key="Header" title="Header Customization" />
        </section>
        <Container className="grow flex items-center justify-center">
          <TopHeaderForm />
        </Container>
      </main>
    </PrivatePageWrapper>
  );
}
