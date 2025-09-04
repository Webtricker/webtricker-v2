"use client";
import { addTechnologies } from "@/redux/features/category/technologies";
import { useAddTechnologyMutation } from "@/redux/features/category/technologyApiSlice";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import {
  CustomModal,
  CustomModalHeader,
} from "@/sharedComponets/ui/modal/Modal";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function AddTechnologyModal() {
  const dispatch = useDispatch();
  const [technology, setTechnology] = useState("");
  const [addTechnology, { isLoading }] = useAddTechnologyMutation();

  //   handlers
  const handleAdd = async () => {
    if (!technology) return;

    try {
      const res = await addTechnology({ name: technology }).unwrap();
      if (res.success) {
        setTechnology("");
        const addedTechnology = {
          _id: res.technology._id,
          name: res.technology.name,
        };
        dispatch(addTechnologies([addedTechnology]));
        dispatch(toggleModal(null))
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error, "error fr om adding category");
    } finally {
      setTechnology("");
    }
  };
  return (
    <CustomModal activeKey="OPEN_PORTFOLIO_TECHNOLOGY_ADD_MODAL">
      <CustomModalHeader title="Add Portfolio Technology" />
      <div className="w-full">
        <div className="w-full pt-5">
          <label className="wt_fs-md mb-1 block">Portfolio Technology</label>
          <input
            value={technology}
            className="wt_fs-md px-4 py-2.5 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px] w-full "
            placeholder="Enter technology"
            onChange={(e) => setTechnology(e.target.value)}
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
