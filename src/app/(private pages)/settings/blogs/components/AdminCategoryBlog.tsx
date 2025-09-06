"use client";
import {
  useDeletePostMutation,
  useGetPostsQuery,
} from "@/redux/features/post/postApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import BlogCardWrapper from "@/sharedComponets/ui/wrapper/BlogCardWrapper";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { TCategory } from "@/types/data";
import { IBlog } from "@/types/post";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type TBlogProps = {
  blog: IBlog;
  refetch: () => Promise<any> | Dispatch<SetStateAction<boolean>>;
};

export const AdminBlogCard = ({ blog, refetch }: TBlogProps) => {
  const [deleteBlog, { isLoading }] = useDeletePostMutation();

  // handlers
  const handleDelete = async (blogId: string) => {
    const agreed = confirm("Are you sure you want to delete this blog?");
    if (!agreed) return;

    try {
      // Call the delete API here
      const res = await deleteBlog(blogId).unwrap();
      console.log(res, "res from delete blog");
      if (res.success) {
        toast.success("Blog deleted successfully");
        refetch(); // Refetch the blogs after deletion
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (error: any) {
      console.error("Error deleting blog:", error?.data);
      toast.error(error?.data?.message || "Failed to delete blog");
    }
  };

  return (
    <BlogCardWrapper
      key={`${blog._id}`}
      createdAt={new Date(blog.createdAt).toString()}
      description={blog.description}
      slug={blog.slug}
      thumnail={blog.thumnail.url}
      title={blog.title}
      excerpt={blog.excerp}
    >
      {isLoading ? (
        <div className="grow flex items-center justify-end px-5">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Button label="Edit" className="!text-sm !py-2.5" />
          <Button
            cb={() => handleDelete(blog._id)}
            label="Delete"
            className="!text-sm !py-2.5 !text-red-500"
          />
        </>
      )}
    </BlogCardWrapper>
  );
};

export default function AdminCategoryBlog({
  category,
}: {
  category: TCategory;
}) {
  const { data, isLoading, isError, error, refetch } = useGetPostsQuery({
    postType: "blog",
    categoryId: category._id,
    limit: 7,
  });

  // conditional rendering
  if (isLoading) {
    return (
      <Container className="section-speacing flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </Container>
    );
  }

  if (!data || !data?.posts?.length || isError) {
    console.log(error);
    return <></>;
  }

  return (
    <Container className="section-speacing">
      <div className="w-full flex items-center justify-between gap-4 flex-wrap lg:gap-10">
        <h4>{category.name}</h4>

        {data.posts?.length > 6 ? (
          <Link href={`/settings/categories/${category._id}`}>
            <Button label="Show All" className="!py-2.5 lg:!py-3" />
          </Link>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
        {data.posts.slice(0, 6).map((blog: IBlog) => (
          <AdminBlogCard refetch={refetch} key={blog._id} blog={blog} />
        ))}
      </div>
    </Container>
  );
}
