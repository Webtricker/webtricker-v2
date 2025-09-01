"use client";
import Link from "next/link";
import React from "react";

interface BouncingTextProps {
  text: string;
  interval?: number;
  duration?: number;
  size?: string;
}

const BouncingText: React.FC<BouncingTextProps> = ({
  text,
  interval = 100,
  duration = 2,
  size = "wt_fs-5xl",
}) => {
  if (!text) {
    return (
      <div className="w-full min-h-20 flex items-center justify-center">
        <p>Add bounching animation text</p>
      </div>
    );
  }

  return (
    <Link
      href="/contact"
      className="inline-block bouncing-text-wrapper bold my-5"
    >
      <p
        className={`bouncing-text font-semibold !leading-[100%] text-center ${size}`}
      >
        {text.split("").map((char: string, index) => (
          <span
            key={index + char}
            className={`inline-block ${
              char === " " ? "opacity-0" : "animate-bounce-custom"
            }`}
            style={{
              animationDelay: `${index * interval}ms`,
              animationDuration: `${duration}s`,
            }}
          >
            {char === " " ? "-" : char}
          </span>
        ))}
      </p>
    </Link>
  );
};

export default BouncingText;
