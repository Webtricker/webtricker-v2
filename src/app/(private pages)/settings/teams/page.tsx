import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import PageTitle from "../../components/PageTitle";
import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";
import TeamMembersContainer from "./components/TeamMembersContainer";

export default function TeamCustomizationPage() {
  return (
    <PrivatePageWrapper className="!p-0">
      <main className="w-full z-0">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle key="TEAMS" title="TEAMS" />
          <Link href="/settings/teams/add">
            <Button className="!py-2.5 whitespace-nowrap" label="Add Team" />
          </Link>
        </section>
        <section className=" w-full py-10 mb-10">
          <TeamMembersContainer />
        </section>
      </main>
    </PrivatePageWrapper>
  );
}
