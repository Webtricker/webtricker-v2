import galleryModern from "@/app/fonts/gallery";

export default function TopAnimation({ word }: { word?: string }) {
  return (
    <h1
      className={`text-center w-full sm:w-auto sm:text-left xl:text-[180px] text-7xl !leading-[70%] heading ${galleryModern.className}`}
    >
      {/* Mobile view: simple text */}
      <span className="md:hidden">{word}</span>
      
      {/* Desktop view: animated spans */}
      <span className="hidden md:inline">
        {word?.split("").map((letter, index) => (
          <span
            key={index}
            className="inline-block mx-1 drop-shadow-2xl animate-top-word will-change-transform"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </span>
    </h1>
  );
}
