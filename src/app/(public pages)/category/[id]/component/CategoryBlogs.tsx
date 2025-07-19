"use client";
import { useCountPostsQuery } from "@/redux/features/post/postApi";
import Pagination from "@/sharedComponets/ui/pagination/Pagination";
import Container from "@/sharedComponets/ui/wrapper/Container";
import React, { useEffect, useState } from "react";

export default function CategoryBlogs({ categoryId }: { categoryId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const {data, isLoading, isError} = useCountPostsQuery({postType:'blog',categoryId})
  console.log(data, ' data from the ')
  useEffect(() => {
     const loadData = async ()=>{
      //  const res = await ().unwrap()
     }
     loadData()
   }, [])

   

  return (
    <Container>
      <div className="w-full mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 lg:gap-6 xl:gap-7 2xl:gap-8"></div>
      <div className="w-full">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={10}
          key="CATEGORY_BLOG_PAGINATION"
        />
      </div>
    </Container>
  );
}
