"use client";
import { toggleShowFloatingDot } from "@/redux/features/dom/floatingDotSlice";
import React from "react";
import { useDispatch } from "react-redux";

interface ButtonProps {
  label: string;
  cb?: () => void;
  className?: string;
  disabled?: boolean;
  labelStyle?: string;
  type?: "submit" | "button";
}

const Button: React.FC<ButtonProps> = ({
  label,
  className = "",
  cb,
  disabled = false,
  labelStyle = "",
  type = "button",
}) => {
  const dispatch = useDispatch();

  // handlers
  const handleClick = () => {
    if (typeof cb === "function") {
      cb();
    }
  };

  const toggleDot = (action: boolean) => {
    dispatch(toggleShowFloatingDot(action));
  };

  return (
    <button
      type={type}
      onMouseOverCapture={() => toggleDot(false)}
      onMouseOutCapture={() => toggleDot(true)}
      onClick={handleClick}
      disabled={disabled}
      className={`wt_btn_cta
        ${className}
        ${disabled ? "cursor-not-allowed" : ""}`}
    >
      <span className="wt_btn_cta-ripple"></span>
      <span className="wt_fs-base wt_btn_cta-title">
        <span className={labelStyle} data-text={label}>
          {label}
        </span>
      </span>
    </button>
  );
};

export default Button;
