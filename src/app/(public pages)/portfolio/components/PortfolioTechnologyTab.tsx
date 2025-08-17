import { ITechnology } from "@/types/data";
import React, { Dispatch, SetStateAction } from "react";


interface Props {
setSelectedTechnology:Dispatch<SetStateAction<ITechnology>>;
selectedTechnology:ITechnology;
technologies: ITechnology[];
}

export default function PortfolioTechnologyTab({
  technologies = [],
  setSelectedTechnology,
  selectedTechnology
}: Props) {
  return (
    <div className="w-full flex flex-wrap lg:flex-nowrap gap-x-10 gap-y-3 lg:gap-0 justify-center overflow-x-auto mb-5 md:mb-7">
      {technologies.map((technology) => (
        <button
         onClick={()=>setSelectedTechnology(technology)}
          className={`block z-0 min-h-12 duration-300 choose-technology-btn h-auto lg:w-full relative whitespace-nowrap lg:min-w-[100px] hover:text-blue-600 ${selectedTechnology?._id===technology?._id?"text-blue-600":""}`}
          key={technology._id}
        >
          <span className="data-wt-hide-cursor relative text-center">{technology.name}</span>
        </button>
      ))}
    </div>
  );
}
