"use client";
import { addCategories } from "@/redux/features/category/categories";
import { useLazyGetCategoriesQuery } from "@/redux/features/category/categoryApiSlice";
import { RootState } from "@/redux/store";
import { TCategory } from "@/types/data";
import React, { SetStateAction, useEffect, Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";

type Props = {
  setSelectedCategory: Dispatch<SetStateAction<TCategory | null>>;
  selectedCategory: TCategory | null;
};

export default function Category({
  selectedCategory,
  setSelectedCategory,
}: Props) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);
  const [loadCategories, { isLoading }] = useLazyGetCategoriesQuery();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await loadCategories({}).unwrap();
        if (res.success && res.categories) {
          dispatch(addCategories(res.categories));
          const uncategorized = res.categories.find(
            (cat: TCategory) =>
              cat.name === "Uncategorized" || cat.name === "uncategorized"
          );
          if (uncategorized && !selectedCategory) {
            setSelectedCategory(uncategorized);
          }
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
  }, [loadCategories, dispatch,categories.length, setSelectedCategory, selectedCategory]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full">
      <div className="w-full">
        <span className="font-semibold mb-2 block">Category:</span>
        <ul className="space-y-2 flex flex-wrap gap-x-10">
          {categories.map((cat) => (
            <li key={cat._id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={cat._id}
                checked={selectedCategory?._id === cat._id}
                onChange={() =>
                  setSelectedCategory(
                    selectedCategory?._id === cat._id ? null : cat
                  )
                }
                className="form-checkbox text-blue-600"
              />
              <label htmlFor={cat._id} className="cursor-pointer">
                {cat.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
