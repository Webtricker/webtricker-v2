"use client";

export default function TopAnimation({ word }: { word?: string }) {
  return (
    <span className="inline-block relative">
      {word?.split("").map((letter, index) => (
        <span
          key={index}
          className="inline-block relative animate-top-word"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
