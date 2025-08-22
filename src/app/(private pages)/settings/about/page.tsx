import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import AboutPageForm from "./components/AboutPageForm";
import { getTeamData, getTestimonialsData } from "@/utils/pageData";

export default async function AboutCustomizationPage() {
  const teamData = await getTeamData();
    const testimonialsData = await getTestimonialsData();
  return (
    <PrivatePageWrapper>
      <AboutPageForm teamData={teamData} testimonialsData={testimonialsData}  />
    </PrivatePageWrapper>
  );
}
