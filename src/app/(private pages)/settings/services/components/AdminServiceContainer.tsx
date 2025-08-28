"use client";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import { useGetServicesQuery } from "@/redux/features/post/postApi";
import { AdminServiceCard } from "./AdminServiceCard";
import { IService } from "@/types/post";


export default function AdminServiceContainer() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    error,
  } = useGetServicesQuery(99);

  const services = data?.services ?? [];


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
      (error as any)?.data?.message || "Failed to load services.";
    return (
      <Container className="text-center">
        <p className="wt_fs-lg text-red-600">{errorMessage}</p>
      </Container>
    );
  }

  // No services found
  if (!services?.length) {
    return (
      <Container className="text-center">
        <p className="wt_fs-lg">No services found.</p>
      </Container>
    );
  }

  // Render services
  return (
    <Container className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
      {services.map((service:IService) => (
        <AdminServiceCard key={service._id} service={service} refetch={refetch} />
      ))}
    </Container>
  );
}
