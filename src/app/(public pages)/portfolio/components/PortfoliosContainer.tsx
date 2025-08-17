"use client"
import Container from "@/sharedComponets/ui/wrapper/Container";
import { ITechnology } from "@/types/data";
import React, { useState } from "react";
import PortfolioTechnologyTab from "./PortfolioTechnologyTab";
import PortfolioTabContent from "./PortfolioTabContent";

export default function PortfoliosContainer({
  technologies = [],
}: {
  technologies: ITechnology[];
}) {
    const [selectedTechnology,setSelectedTechnology] = useState(technologies[0]||{})
  return (
    <section className="w-full">
      <Container className="">
        <PortfolioTechnologyTab selectedTechnology={selectedTechnology} setSelectedTechnology={setSelectedTechnology} technologies={technologies} />
        <PortfolioTabContent selectedTechnology={selectedTechnology} />
      </Container>
    </section>
  );
}
