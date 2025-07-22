"use client";
import {
  useLazyCountPostsQuery,
  useLazyGetPostsQuery,
} from "@/redux/features/post/postApi";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import Pagination from "@/sharedComponets/ui/pagination/Pagination";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { IBlog } from "@/types/post";
import React, { useEffect, useState } from "react";
import CategoryBlog from "./CategoryBlog";

export default function CategoryBlogsContainer({
  categoryId,
}: {
  categoryId: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [localLoading, setLocalLoading] = useState(true);

  const [blogs, setblogs] = useState<IBlog[]>([]);
  const [countPosts, { isLoading: paginationLoading }] =
    useLazyCountPostsQuery();
  const [getPosts] = useLazyGetPostsQuery();

  useEffect(() => {
    const loadData = async () => {
      setLocalLoading(true); // <-- Immediately show spinner
      try {
        const result = await getPosts({
          postType: "blog",
          categoryId,
          page: currentPage,
          limit: 8,
          // limit: 20,
        }).unwrap();
        if (result?.success && result?.posts?.length > 0) {
          setblogs(result.posts);
        } else {
          setblogs([]); // clear old data if no new data
        }
      } catch (error) {
        console.log(error);
        setblogs([]);
      } finally {
        setLocalLoading(false); // <-- Hide spinner
      }
    };

    loadData();
  }, [categoryId, getPosts, currentPage]);

  // count the posts and set pagination total pages.
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await countPosts({
          postType: "blog",
          categoryId,
        }).unwrap();
        // if (result?.success && result?.counts > 20 && result.counts / 20 >= 2) {
          // const pages = Math.floor((result.counts / 20) as number);
          if (result?.success && result?.counts > 8 && result.counts / 8 >= 1) {
            const pages = Math.ceil((result.counts / 8) as number);
            console.log(pages ,  ' pages counts');
          setTotalPages(pages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    // initial call.
    loadData();
  }, [countPosts, categoryId]);

  return (
    <Container>
      {localLoading ? (
        <div className="w-full  section-speacing ">
          <div className="w-full min-h-[500px] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <CategoryBlog blogs={blogs} />
      )}

      {paginationLoading ? (
        <div className="w-full flex items-center justify-center h-20">
          <LoadingSpinner />
        </div>
      ) : (
        totalPages > 1 && (
          <div className="w-full section-speacing">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              key="CATEGORY_BLOG_PAGINATION"
            />
          </div>
        )
      )}
    </Container>
  );
}
