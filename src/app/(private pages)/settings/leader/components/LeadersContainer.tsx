"use client";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import { useGetLeaderInfoQuery } from "@/redux/features/team/teamApiSlice";
import { LeaderCard } from "./LeaderCard";
import { ILeaderInfo } from "@/types/data";

export default function LeadersContainer() {
  const { data, isLoading, isError, refetch, error } = useGetLeaderInfoQuery({});

  const leaderData = data?.leaderData ?? [];

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
      (error as any)?.data?.message || "Failed to load leaderData.";
    return (
      <Container className="text-center">
        <p className="wt_fs-lg text-red-600">{errorMessage}</p>
      </Container>
    );
  }

  // No team info found
  if (!leaderData.length) {
    return (
      <Container className="text-center">
        <p className="wt_fs-lg">No leader info found.</p>
      </Container>
    );
  }

  // Render services
  return (
    <Container className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
      {leaderData?.map((leaderInfo: ILeaderInfo) => (
        <LeaderCard key={leaderInfo._id} leaderInfo={leaderInfo} refetch={refetch} />
      ))}
    </Container>
  );
}
