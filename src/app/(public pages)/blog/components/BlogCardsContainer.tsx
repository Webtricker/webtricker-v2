"use client";
import { addCategories } from "@/redux/features/category/categories";
import { useLazyGetCategoriesQuery } from "@/redux/features/category/categoryApiSlice";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryBlog from "./CategoryBlog";
import { RootState } from "@/redux/store";
import Container from "@/sharedComponets/ui/wrapper/Container";
// import {blogCategories} from '@/data/DummyCate'

export default function BlogCardsContainer() {
  // hooks
  const dispatch = useDispatch();
  const [loadCategories, { isLoading }] = useLazyGetCategoriesQuery();
  const { categories } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await loadCategories({}).unwrap();
        if (res.success && res.categories) {
          dispatch(addCategories(res.categories));
        } else {
          throw new Error("Error loading categories");
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [loadCategories, dispatch]);

  if (isLoading)
    return (
      <Container className="flex items-center justify-center">
        <LoadingSpinner />
      </Container>
    );
  if (!isLoading && !categories.length)
    return (
      <Container>
        <p className="text-center wt_fs-lg">No category found</p>
      </Container>
    );
  return (
    <>
      {categories.map((category) => (
        <CategoryBlog key={category._id} category={category} />
      ))}
    </>
  );
}
