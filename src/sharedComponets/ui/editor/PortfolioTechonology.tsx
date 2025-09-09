"use client";
import { ITechnology } from "@/types/data";
import React, { SetStateAction, Dispatch, useEffect, useState } from "react";
import { useDispatch} from "react-redux";
import LoadingSpinner from "../loading/LoadingSpinner";
import { useGetTechnologiesQuery } from "@/redux/features/category/technologyApiSlice";

type Props = {
  setSelectedTechnology: Dispatch<SetStateAction<ITechnology | null>>;
  selectedTechnology: ITechnology | null;
};

export default function PortfolioTechonology({
  selectedTechnology,
  setSelectedTechnology,
}: Props) {
  const dispatch = useDispatch();
  const [technologies, setTechnologies] = useState<ITechnology[]>([])
  const { data, isLoading } = useGetTechnologiesQuery({});

  useEffect(() => {
    if (data?.technologies) {
      setTechnologies(data?.technologies);
    }
  }, [data, dispatch]);

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="w-full">
      <div className="w-full">
        <span className="font-semibold mb-2 block">Technology:</span>
        <ul className="flex items-center flex-wrap gap-x-10">
          {technologies.map((technology, _i) => (
            <li
              key={technology._id + _i}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                id={technology._id}
                checked={selectedTechnology?._id === technology._id}
                onChange={() =>
                  setSelectedTechnology(
                    selectedTechnology?._id === technology._id
                      ? null
                      : technology
                  )
                }
                className="form-checkbox text-blue-600"
              />
              <label htmlFor={technology._id} className="cursor-pointer">
                {technology.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
