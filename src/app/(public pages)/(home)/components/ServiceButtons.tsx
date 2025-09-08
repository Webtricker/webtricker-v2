"use client";
import { IService } from "@/types/post";
import { useCallback } from "react";

function ServiceButtons({ serviceData }) {
  const scrollToSection = useCallback((id: string, offset: number = 0) => {
    if (typeof window === "undefined") return;

    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
      {(serviceData as IService[]).map((service) => (
        <button
          key={service._id}
          className="cursor-pointer border p-2 rounded-full text-base hover:shadow-2xl duration-300 border-slate-300 shadow-md"
          onClick={() => scrollToSection(service._id, -120)}
        >
          {service.title}
        </button>
      ))}
    </div>
  );
}

export default ServiceButtons;
