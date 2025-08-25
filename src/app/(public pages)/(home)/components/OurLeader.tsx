import TeammemberCard from "@/sharedComponets/ui/card/TeammemberCard";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { ILeaderInfo } from "@/types/data";
import React from "react";

export default function OurLeader({title,leaderData=[]}:{title:string,leaderData:ILeaderInfo[]}) {
  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
        <div className="w-full text-center mb-14 md:mb-16 lg:mb-20">
            <h3 className="text-center middle-border">{title || "Our Leaders"}</h3>
        </div>
      <div className="w-full overflow-x-auto">
        <Container className="py-2 min-w-[620px] team-members-wrap flex justify-center w-full gap-5 lg:gap-10">
        {leaderData.map((team) => (
          <TeammemberCard team={team} key={team.name} />
        ))}
      </Container>
      </div>
    </section>  
  ); 
}
