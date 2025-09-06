import React from "react";
import HomePageForm from "./components/HomePageForm";
import {
  getPostsData,
  getServicesData,
  getTestimonialsData,
} from "@/utils/pageData";

export default async function HomeCustomizationPage() {
  const testimonialsData = await getTestimonialsData();
  const serviceData = await getServicesData(4);
  const posts = await getPostsData(4);
  return (
    <>
      <HomePageForm
        posts={posts}
        serviceData={serviceData}
        testimonials={testimonialsData}
      />
    </>
  );
}
