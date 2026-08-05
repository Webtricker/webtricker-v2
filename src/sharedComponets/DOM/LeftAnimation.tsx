"use client";

export default function LeftAnimation({ word }: { word?: string }) {
  return (
    <span>
      {word?.split("").map((letter, index) => (
        <span
          key={index}
          className="inline-block mx-1 drop-shadow-2xl animate-left-word will-change-transform"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
