import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import ContactPageForm from "./components/ContactPageForm";
import PageTitle from "../../components/PageTitle";

export default function ContactCustomizationPage() {
  return (
    <PrivatePageWrapper>
      <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
        <PageTitle key="Contact_page" title="Contact Page" />
      </section>
      <ContactPageForm />
    </PrivatePageWrapper>
  );
}
