"use client";

import { useGetCategoriesQuery } from "@/redux/features/category/categoryApiSlice";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import AdminCategoryBlog from "./AdminCategoryBlog";


export default function AdminBlogsContainer() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery({});

  const categories = data?.categories ?? [];

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
      (error as any)?.data?.message || "Failed to load categories.";
    return (
      <Container className="text-center">
        <p className="wt_fs-lg text-red-600">{errorMessage}</p>
      </Container>
    );
  }

  // No categories found
  if (!categories.length) {
    return (
      <Container className="text-center">
        <p className="wt_fs-lg">No categories found.</p>
      </Container>
    );
  }

  // Render categories
  return (
    <>
      {categories.map((category) => (
        <AdminCategoryBlog
          key={category._id ?? category.name} // Fallback to name if _id is missing
          category={category}
        />
      ))}
    </>
  );
}
