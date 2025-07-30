import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import React from "react";
import AddTestimonial from "./components/AddTestimonial";

export default function TestimonialAddPage() {
  return (
    <PrivatePageWrapper>
      <div className="w-full min-h-[90vh] flex flex-col lg:px-10 gap-5 lg:gap-20">
        <AddTestimonial />
      </div>
    </PrivatePageWrapper>
  );
}
