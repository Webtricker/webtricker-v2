"use client";
import { addCategories } from "@/redux/features/category/categories";
import { useLazyGetCategoriesQuery } from "@/redux/features/category/categoryApiSlice";
import { RootState } from "@/redux/store";
import { TCategory } from "@/types/data";
import React, { SetStateAction, useEffect, Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";

type Props = {
  setSelectedCategories: Dispatch<SetStateAction<TCategory[]>>;
  selectedCategories: TCategory[];
};

export default function Category({
  selectedCategories,
  setSelectedCategories,
}: Props) {
  // hooks
  const dispatch = useDispatch();
  const { categories } = useSelector((state: RootState) => state.categories);

  const [loadCategories, { isLoading }] = useLazyGetCategoriesQuery();

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

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="w-full">
      <div className="w-full">
        <div className="w-full flex">
          <span className="font-semibold mr-5">Categories:</span>{" "}
          {!selectedCategories.length ? (
            <span>uncategorized</span>
          ) : (
            <div className="w-full flex items-center gap-x-4 gap-y-2 flex-wrap">
                {selectedCategories.map((cat: TCategory, _i: number) => (
              <span className="wt_fs-md" key={cat._id + _i}>
                {cat.name}
                {_i !== selectedCategories.length - 1 ? "," : ""}
              </span>
            ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex mt-5 gap-5">
        <p className="opacity-0 font-semibold">Categories:</p>
        {categories.length ? (
          <div className="grow flex flex-wrap gap-x-10 gap-y-2">
            {categories.map((cat) => (
              <div className="flex gap-2 items-center wt_fs-md" key={cat._id}>
                <input
                  checked={selectedCategories.some((c) => c._id === cat._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories((prev) => [...prev, cat]);
                    } else {
                      setSelectedCategories((prev) =>
                        prev.filter((c) => c._id !== cat._id)
                      );
                    }
                  }}
                  className="w-5 h-5"
                  type="checkbox"
                />{" "}
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
