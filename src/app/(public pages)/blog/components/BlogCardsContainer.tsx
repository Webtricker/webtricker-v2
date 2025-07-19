"use client";
import { useGetCategoriesQuery } from "@/redux/features/category/categoryApiSlice";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import React from "react";
import CategoryBlog from "./CategoryBlog";
import Container from "@/sharedComponets/ui/wrapper/Container";

export default function BlogCardsContainer() {
  // hooks
  const {data, isLoading, isError } = useGetCategoriesQuery({});

  if (isLoading)
    return (
      <Container className="flex items-center justify-center">
        <LoadingSpinner />
      </Container>
    );
  if (!isLoading && !data.categories?.length || isError)
    return (
      <Container>
        <p className="text-center wt_fs-lg">No category found</p>
      </Container>
    );
  return (
    <>
      {data.categories.map((category) => (
        <CategoryBlog key={category._id} category={category} />
      ))}
    </>
  );
}
