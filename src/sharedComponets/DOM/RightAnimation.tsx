"use client";

export default function RightAnimation({ word }: { word?: string }) {
  return (
    <span className="inline-block relative">
      {word?.split("").map((letter, index) => (
        <span
          key={index}
          className="inline-block relative animate-right-word"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
