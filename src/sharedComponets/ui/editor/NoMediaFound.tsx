import React from "react";

export default function NoMediaFound({type="image"}:{type?:string}) {
  return (
    <div
      className="w-full flex items-center justify-center px-2 relative rounded-[10px] overflow-hidden max-h-[200px] h-full"
    >
       <p className="text-center"> No {type} found. Please upload first.</p>
    </div>
  );
}
