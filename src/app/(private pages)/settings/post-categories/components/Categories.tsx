"use client";
import { deleteCategory } from "@/redux/features/category/categories";
import {
  useDeleteCategoryMutation,
  useLazyGetCategoriesQuery,
} from "@/redux/features/category/categoryApiSlice";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { TCategory } from "@/types/data";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const CategoryCard = ({ category }: { category: TCategory }) => {
  // hook
  const dispatch = useDispatch();
  const [removeCategory, { isLoading }] = useDeleteCategoryMutation();

  // handlers
  const handleDelete = async () => {
    const agreed = confirm("Are you sure you want to delete this category?");
    if (!agreed) return;

    try {
      // Call the delete API here
      const res = await removeCategory(category._id).unwrap();
      if (res.success) {
        toast.success(res.message);
        dispatch(deleteCategory(category._id));
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.error("Error deleting category:", error?.data);
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };
  return (
    <div className="w-auto min-w-[200px] flex gap-5 justify-between items-center py-3 px-5 bg-slate-100 rounded-[6px] dark:bg-slate-800">
      <h6 className="mb-2">{category.name}</h6>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <button onClick={handleDelete} className="text-red-500">
          <TrashCanIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default function Categories() {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loadCategories, { isLoading }] = useLazyGetCategoriesQuery();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await loadCategories({}).unwrap();
        if (res.success && res.categories) {
          setCategories(res.categories);
        } else {
          throw new Error("Error loading categories");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (categories.length === 0) {
      loadData();
    }
  }, [categories.length, loadCategories]);

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  return (
    <div className="w-full  flex items-center flex-wrap gap-10">
      {categories.map((category) => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </div>
  );
}
