import React from "react";
import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import { IBlog } from "@/types/post";
import NoBlogFoundMsg from "@/app/(public pages)/blog/[slug]/components/NoBlogFoundMsg";
import EditBlogPage from "../../blogs/[slug]/components/EditBlogPage";
import EditServicePage from "./components/EditServicePage";

const getServiceData = async (slug: string) => {
  // You can fetch data here on the server f
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${slug}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error, " Error fetching data");
  }
  return null;
};

export default async function SingleServicePage({ params }) {
  const { slug } = await params;

  const data = await getServiceData(slug);
  if (!data?.post) return <NoBlogFoundMsg />;
  const post = data.post || ({} as IBlog);
  return (
    <PrivatePageWrapper>
      <div className="w-full flex flex-col lg:px-10 gap-5 lg:gap-20">
        <EditServicePage post={post} />
      </div>
    </PrivatePageWrapper>
  );
}
