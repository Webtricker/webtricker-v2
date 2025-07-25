import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import PageTitle from "../../components/PageTitle";
import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";
import ServicesBanner from "@/app/(public pages)/services/components/ServicesBanner";
import AdminServiceContainer from "./components/AdminServiceContainer";

export default function ServicesCustomizationPage() {
  return (
    <PrivatePageWrapper className="!p-0">
      <main className="w-full z-0">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle key="SERVICES" title="Services" />
          <Link href="/settings/services/add">
            <Button className="!py-2.5 whitespace-nowrap" label="Add Service" />
          </Link>
        </section>
        <section
          className={`w-full min-h-screen z-0 flex flex-col relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}
        >
          <ServicesBanner />
          <AdminServiceContainer />
        </section>
      </main>
    </PrivatePageWrapper>
  );
}
