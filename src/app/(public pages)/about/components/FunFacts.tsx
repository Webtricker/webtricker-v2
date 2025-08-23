import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
type Props = {
  aboutUsAnalytics: {
    title: string;
    subTitle: string;
    teamMembers: string;
    teamMembersText: string;
    projectsCompleted: string;
    projectsCompletedText: string;
    growingRate: string;
    growingRateText: string;
    yearsOfExperience: string;
    yearsOfExperienceText: string;
  };
};
export default function FunFacts({ aboutUsAnalytics }: Props) {
  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <Container className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-y-2">
        <div className="w-full col-span-2 lg:col-span-1 text-center md:text-left mb-3 md:mb-0">
          <p className="bold">{aboutUsAnalytics?.subTitle}</p>
          <h3 className="heading md:max-w-[350px] ">
            {aboutUsAnalytics?.title}
          </h3>
        </div>
        <div className="w-full flex flex-col gap-10 text-center md:text-left">
          <div className="w-full">
            <span className="wt_fs-7xl bold">
              {aboutUsAnalytics?.projectsCompleted}+
            </span>
            <p className="bold uppercase wt_fs-md">
              {aboutUsAnalytics?.projectsCompletedText}
            </p>
          </div>
          <div className="w-full">
            <span className="wt_fs-7xl bold">
              {aboutUsAnalytics?.teamMembers}%
            </span>
            <p className="bold uppercase wt_fs-md">
              {aboutUsAnalytics?.teamMembersText}
            </p>
          </div>
          <div className="w-full"></div>
        </div>
        <div className="w-full flex flex-col gap-10 text-center md:text-left">
          <div className="w-full">
            <span className="wt_fs-7xl bold">
              {aboutUsAnalytics?.yearsOfExperience}+
            </span>
            <p className="bold uppercase wt_fs-md">
              {aboutUsAnalytics?.yearsOfExperienceText}
            </p>
          </div>
          <div className="w-full">
            <span className="wt_fs-7xl bold">
              {aboutUsAnalytics?.growingRate}%
            </span>
            <p className="bold uppercase wt_fs-md">
              {aboutUsAnalytics?.growingRateText}
            </p>
          </div>
          <div className="w-full"></div>
        </div>
      </Container>
    </section>
  );
}
