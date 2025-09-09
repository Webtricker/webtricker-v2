"use client";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import AdminCategoryPortfolio from "./AdminCategoryPortfolio";
import { useGetTechnologiesQuery } from "@/redux/features/category/technologyApiSlice";


export default function AdminPortfolios() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetTechnologiesQuery({});

  const technologies = data?.technologies ?? [];
  
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
      (error as any)?.data?.message || "Failed to load portfolio technologies.";
    return (
      <Container className="text-center">
        <p className="wt_fs-lg text-red-600">{errorMessage}</p>
      </Container>
    );
  }

  // No categories found
  if (!technologies?.length) {
    return (
      <Container className="text-center">
        <p className="wt_fs-lg">No technologies found.</p>
      </Container>
    );
  }

  // Render categories
  return (
    <>
      {technologies.map((technology) => (
        <AdminCategoryPortfolio
          key={technology._id ?? technology.name} // Fallback to name if _id is missing
          technology={technology}
        />
      ))}
    </>
  );
}
