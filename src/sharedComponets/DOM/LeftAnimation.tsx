"use client";

export default function LeftAnimation({ word }: { word?: string }) {
  return (
    <span className="inline-block relative">
      {word?.split("").map((letter, index) => (
        <span
          key={index}
          className="inline-block relative animate-left-word"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
