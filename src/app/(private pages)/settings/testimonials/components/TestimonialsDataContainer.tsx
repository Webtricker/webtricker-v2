"use client";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import {  ITestimonialsInfo } from "@/types/data";
import { useGetTestimonialInfoQuery } from "@/redux/features/testimonials/testimonialsApiSlice";
import { TestimonialCard } from "./TestimonialCard";

export default function TestimonialsDataContainer() {
  const { data, isLoading, isError, refetch, error } = useGetTestimonialInfoQuery({});

  const testimonialsData = data?.testimonialsData ?? [];

  // Show loading spinner
  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </Container>
    );
  }

  // Handle error case
  if (isError) {
    const errorMessage =
      (error as any)?.data?.message || "Failed to load testimonials data.";
    return (
      <Container className="text-center">
        <p className="wt_fs-lg text-red-600">{errorMessage}</p>
      </Container>
    );
  }

  // No team info found
  if (!testimonialsData.length) {
    return (
      <Container className="text-center min-h-[400px] flex items-center justify-center">
        <p className="wt_fs-lg">No Testimonials data found.</p>
      </Container>
    );
  }

  // Render services
  return (
    <Container className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
      {testimonialsData.map((testimonial: ITestimonialsInfo) => (
        <TestimonialCard key={testimonial._id} testimonial={testimonial} refetch={refetch} />
      ))}
    </Container>
  );
}
