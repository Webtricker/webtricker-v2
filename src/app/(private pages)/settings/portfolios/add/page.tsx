import React from "react";
import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import PortfolioEditor from "./components/PortfolioEditor";

export default function AddPortfolioPage() {
  return (
    <PrivatePageWrapper>
      <div className="w-full flex flex-col lg:px-10 gap-5 lg:gap-20">
          <PortfolioEditor />
      </div>
    </PrivatePageWrapper>
  );
}