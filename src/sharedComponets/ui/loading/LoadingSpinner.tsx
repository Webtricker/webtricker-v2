import React from "react";
import { SpinnerIcon } from "../icons/Icons";

const LoadingSpinner = ({ className = "" }: { className?: string }) => {
  return <SpinnerIcon className={`max-w-6 ${className} !animate-spin`} />;
};

export default LoadingSpinner;
