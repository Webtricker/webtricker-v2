import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import React from "react";
import AddLeader from "./components/AddLeader";

export default function LeaderAddPage() {
  return (
    <PrivatePageWrapper>
      <div className="w-full min-h-[90vh] flex flex-col lg:px-10 gap-5 lg:gap-20">
        <AddLeader />
      </div>
    </PrivatePageWrapper>
  );
}
