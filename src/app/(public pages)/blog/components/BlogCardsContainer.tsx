import React from "react";
import { TCategory } from "@/types/data";
import CategoryBlog from "./CategoryBlog";

const getCategories = async (): Promise<TCategory[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
      {
        next: { revalidate: 120 }, // revalidate in every 30 minutes
      },
    );

    if (!res.ok) {
      console.error("Failed to fetch categories (Server)");
      return [];
    }
    const result = await res.json();
    return result?.categories || [];
  } catch (error) {
    console.error("Error fetching categories (Server):", error);
    return [];
  }
};

export default async function ServerCategoriesList() {
  const categories = await getCategories();
  console.log("render info for blog cards container");
  if (!categories.length) {
    return (
      <div className="text-center">
        <p className="wt_fs-lg">No categories found.</p>
      </div>
    );
  }

  return (
    <>
      {categories.map((category: TCategory) => (
        <CategoryBlog key={category._id ?? category.name} category={category} />
      ))}
    </>
  );
}
