import Button from "@/sharedComponets/ui/buttons/Button";
import { ITechnology } from "@/types/data";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  setSelectedTechnology: Dispatch<SetStateAction<ITechnology | null>>;
  selectedTechnology: ITechnology | null;
  technologies: ITechnology[];
}

export default function PortfolioTechnologyTab({
  technologies = [],
  setSelectedTechnology,
}: Props) {
  return (
    <div className="w-full flex py-1 gap-x-5 gap-y-3 justify-center overflow-x-auto mb-5 md:mb-7">
      <Button
        className="!px-4 md:!px-8"
        cb={() => setSelectedTechnology(null)}
        key="All technology tab"
        label="All"
      />

      {technologies.map((technology) => (
        <Button
          className="!px-4 md:!px-8"
          cb={() =>
            setSelectedTechnology(
              technology?.name === "All" ? null : technology
            )
          }
          key={technology._id}
          label={technology.name}
        />
      ))}
    </div>
  );
}
