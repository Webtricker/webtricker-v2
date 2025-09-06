"use client";
import {
  addTechnologies,
  deleteTechnology,
} from "@/redux/features/category/technologies";
import {
  useDeleteTechnologyMutation,
  useGetTechnologiesQuery,
} from "@/redux/features/category/technologyApiSlice";
import { RootState } from "@/redux/store";
import { TrashCanIcon } from "@/sharedComponets/ui/icons/Icons";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { ITechnology } from "@/types/data";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const TechnologyCard = ({ technology }: { technology: ITechnology }) => {
  // hook
  const dispatch = useDispatch();
  const [removeTechnology, { isLoading }] = useDeleteTechnologyMutation();

  // handlers
  const handleDelete = async () => {
    const agreed = confirm(
      "Are you sure you want to delete this portfolio technology?"
    );
    if (!agreed) return;

    try {
      // Call the delete API here
      const res = await removeTechnology(technology._id).unwrap();
      if (res.success) {
        toast.success(res.message);
        dispatch(deleteTechnology(technology._id));
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.error("Error deleting technology:", error?.data);
      toast.error(error?.data?.message || "Failed to technology blog");
    }
  };
  return (
    <div className="w-auto min-w-[200px] flex gap-5 justify-between items-center py-3 px-5 bg-slate-100 rounded-[6px]">
      <h6 className="mb-2">{technology.name}</h6>

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

export default function Technologies() {
  // hooks
  const dispatch = useDispatch();
  const { data, isLoading } = useGetTechnologiesQuery({});
  const { technologies } = useSelector(
    (state: RootState) => state.technologies
  );

  useEffect(() => {
    if (data?.technologies && !technologies.length) {
      dispatch(addTechnologies(data.technologies));
    }
  }, [data?.technologies, dispatch, technologies.length]);

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );

  if (!technologies.length)
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <p>Please add portfolio technology first</p>
      </div>
    );
  return (
    <div className="w-full  flex items-center flex-wrap gap-10">
      {!!data?.technologies &&
        data?.technologies?.map((technology) => (
          <TechnologyCard key={technology._id} technology={technology} />
        ))}
    </div>
  );
}
