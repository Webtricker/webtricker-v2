import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import React from "react";
import TeamEditForm from "./components/TeamInfoAddForm";

export default function TeamMemberAddPage() {
  return (
    <PrivatePageWrapper>
      <div className="w-full flex flex-col lg:px-10 gap-5 lg:gap-20">
        <TeamEditForm />
      </div>
    </PrivatePageWrapper>
  );
}
