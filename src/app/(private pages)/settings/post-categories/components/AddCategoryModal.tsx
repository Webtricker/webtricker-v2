"use client";
import { addCategories } from "@/redux/features/category/categories";
import { useAddCategoryMutation } from "@/redux/features/category/categoryApiSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import {
  CustomModal,
  CustomModalHeader,
} from "@/sharedComponets/ui/modal/Modal";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function AddCategoryModal() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  //   handlers
  const handleAdd = async () => {
    if (!category) return;

    try {
      const res = await addCategory({ name: category }).unwrap();
      if (res.success) {
        setCategory("");
        const addedCategory = {
          _id: res.category._id,
          name: res.category.name,
        };
        dispatch(addCategories([addedCategory]));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      
    } catch (error) {
      console.error(error, " error fr om adding category");
    }
    finally{
        setCategory('')
    }
  };
  return (
    <CustomModal activeKey="OPEN_POST_CATEGORY_ADD_MODAL">
      <CustomModalHeader title="Add Category" />
      <div className="w-full">
        <div className="w-full pt-5">
          <label className="wt_fs-md mb-1 block">Category</label>
          <input
            value={category}
            className="wt_fs-md px-4 py-2.5 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px] w-full "
            placeholder="Enter category"
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="w-full flex justify-center mt-5">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Button
              disabled={isLoading}
              className="!py-3"
              label="Add"
              cb={handleAdd}
            />
          )}
        </div>
      </div>
    </CustomModal>
  );
}
