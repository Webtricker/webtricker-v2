"use client"
import React from "react";
import PrivatePageWrapper from "../../components/PrivatePageWrapper";
import PageTitle from "../../components/PageTitle";
import { useGetPostsQuery } from "@/redux/features/post/postApi";

export default function BlogsPage() { 
  const  {data, isLoading, isError} = useGetPostsQuery('blog')
  console.log(data?.posts,' data from blogs')
  return (
    <PrivatePageWrapper>
      <div className="w-full flex flex-col  gap-20">
        <PageTitle key="CUSTOMIZE_MENU" title="Blogs" />
        <div className="w-full lg:px-10 ">

        </div>
      </div>
    </PrivatePageWrapper>
  );
}
