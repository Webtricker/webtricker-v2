import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import React from "react";
import ServicePageEditor from "./components/ServicePageEditor";

export default function ServiceAddPage() {
  return (
    <PrivatePageWrapper>
      <div className="w-full flex flex-col lg:px-10 gap-5 lg:gap-20">
        <ServicePageEditor />
      </div>
    </PrivatePageWrapper>
  );
}
