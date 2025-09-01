import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import PageTitle from "../../components/PageTitle";
import FooterForm from "./components/FooterForm";

export default function FooterCustomizationPage() {
  return (
    <PrivatePageWrapper>
      <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
        <PageTitle key="Footer" title="Footer Customization" />
      </section>
      <FooterForm />
    </PrivatePageWrapper>
  );
}
