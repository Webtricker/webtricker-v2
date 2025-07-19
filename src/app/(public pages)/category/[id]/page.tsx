import Container from "@/sharedComponets/ui/wrapper/Container";
import React from "react";
import CategoryBlogs from "./component/CategoryBlogs";
// import BlogCardsContainer from "./components/BlogCardsContainer";

export default async function CategoryPage({ params }: { params: { id: string } }) {
     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${params.id}`);
     const data = await res.json();

     if(!data.success) return <Container><h1 className="text-center">Invalid category</h1></Container>
  return (
    <main className="w-full z-0">
      <section className={`w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}>
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-4">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              {data.category?.name}
            </h1>
            <p className="!text-white wt_text-shadow wt_fs-xl bold mt-5">
              Explore our blog posts about {data.category?.name}.
            </p>
          </div>
        </Container>
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src="/videos/blogs/blog.mp4"
        >
          <source src="/videos/blogs/blog.mp4" type="video/mp4" />
        </video>
      </section>
      <CategoryBlogs categoryId={data.category?._id}  />
    </main>
  );
}
