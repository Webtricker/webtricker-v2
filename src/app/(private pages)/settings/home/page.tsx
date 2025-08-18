import React from "react";
import HomePageForm from "./components/HomePageForm";
import { getTestimonialsData } from "@/utils/pageData";
import { demoJson } from "@/data/demoData";

export default async function HomeCustomizationPage() {
  const testimonialsData = await getTestimonialsData();
  return (
    <>
      <HomePageForm testimonials={testimonialsData} homePageData={demoJson} />
    </>
  );
}
