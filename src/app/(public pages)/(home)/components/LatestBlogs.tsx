import galleryModern from "@/app/fonts/gallery";
import Button from "@/sharedComponets/ui/buttons/Button";
import BlogCardWrapper from "@/sharedComponets/ui/wrapper/BlogCardWrapper";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { IBlog } from "@/types/post";
import React from "react";

// TEMP: revalidate=0 for active dev — RESET before launch (was: 60 * 30)
const POSTS_REVALIDATE_SECONDS = 0;

export const getLatestPosts = async (): Promise<IBlog[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?limit=4`,
      {
        next: { revalidate: POSTS_REVALIDATE_SECONDS },
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch posts . Status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data?.posts || [];
  } catch (error) {
    console.error(`Error fetching posts`, error);
    return null;
  }
};

// ===== root component =======

type BlogProps = {
  blogSectionTitle: {
    large: string;
    medium: string;
    small: string;
  };
};
export default async function LatestBlogs({ blogSectionTitle }: BlogProps) {
  const posts = await getLatestPosts();
  if (!posts || posts.length === 0) {
    return <></>;
  }

  return (
    <section className="py-8 md:py-10 lg:py-14 xl:py-16 2xl:py-18">
      <Container>
        <h2 className="heading inline !leading-[100%]">
          {blogSectionTitle?.large || "Updates,"}
        </h2>
        <div className="w-full flex flex-wrap md:flex-nowrap items-end gap-2">
          <h2 className={`heading !leading-[100%] ${galleryModern.className}`}>
            {blogSectionTitle?.medium || "Insights"}
          </h2>
          <h6 className="mb-2 2xl:mb-4 heading">
            {blogSectionTitle?.small || "Our Newest Articles"}
          </h6>
        </div>
        <div className=" section-inner-speacing w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 gap-y-14 md:gap-8 md:gap-y-14 lg:gap-10 lg:gap-y-14">
          {posts.map((blog) => (
            <BlogCardWrapper
              key={blog._id}
              createdAt={new Date(blog.createdAt).toString()}
              description={blog.description}
              slug={blog.slug}
              thumnail={blog.thumnail.url}
              title={blog.title}
              excerpt={blog.excerp}
            >
              <Button label="Read More" className="!text-sm !py-2.5" />
            </BlogCardWrapper>
          ))}
        </div>
      </Container>
    </section>
  );
}

// const BlogCard = ({ blog }: { blog: IBlog }) => {
//   return (
//     <div className="w-full dark:border dark:border-slate-700 shadow hover:shadow-xl duration-300 rounded-[10px]">
//       <div className="w-full h-[250px] group rounded-t-[8px] overflow-hidden ">
//         <Image
//           src={blog.thumnail.url}
//           className="duration-300 group-hover:scale-110 w-full h-full object-cover"
//           width={blog.thumnail.width}
//           height={250}
//           alt={blog.title}
//         />
//       </div>
//       <div className="w-full p-4 pt-5">
//         <h6 className="heading mb-2">{trimText(blog.title, 52)}</h6>
//         <p>{trimText(blog.excerp ? blog.excerp : blog.description, 133)}</p>
//         <div className="w-full flex justify-between items-center mt-3">
//           <p className="bold">{formatDateToShortString(blog.createdAt)}</p>{" "}
//           <Link
//             data-wt-hide-cursor
//             className="wt_btn duration-300 bold font-semibold hover:underline"
//             href={`/blog/${blog.slug}`}
//           >
//             Read More
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };
