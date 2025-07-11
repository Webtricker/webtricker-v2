import React from "react";

export default function NoMediaFound({type}:{type?:string}) {
  return (
    <div
      className="w-full relative rounded-[10px] overflow-hidden max-h-[200px] h-full"
    >
        No {type} found. Please upload first.
    </div>
  );
}
