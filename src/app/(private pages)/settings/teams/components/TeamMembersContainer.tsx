"use client";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import { useGetTeamInfoQuery } from "@/redux/features/team/teamApiSlice";
import { TeamCard } from "./TeamCard";
import { ITeamInfo } from "@/types/data";

export default function TeamMembersContainer() {
  const { data, isLoading, isError, refetch, error } = useGetTeamInfoQuery({});

  const teamData = data?.teamData ?? [];
  console.log(teamData, "tamdata from teamMembersContainer container");

  // Show loading spinner
  if (isLoading) {
    return (
      <Container className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </Container>
    );
  }

  // Handle error case
  if (isError) {
    const errorMessage =
      (error as any)?.data?.message || "Failed to load team data.";
    return (
      <Container className="text-center">
        <p className="wt_fs-lg text-red-600">{errorMessage}</p>
      </Container>
    );
  }

  // No team info found
  if (!teamData.length) {
    return (
      <Container className="text-center">
        <p className="wt_fs-lg">No team info found.</p>
      </Container>
    );
  }

  // Render services
  return (
    <Container className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
      {teamData.map((teamInfo: ITeamInfo) => (
        <TeamCard key={teamInfo._id} teamInfo={teamInfo} refetch={refetch} />
      ))}
    </Container>
  );
}
