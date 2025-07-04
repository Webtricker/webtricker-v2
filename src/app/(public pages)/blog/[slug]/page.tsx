import Container from '@/sharedComponets/ui/wrapper/Container'
import React from 'react'
import NoBlogFoundMsg from './components/NoBlogFoundMsg';
import HtmlContentParser from '@/sharedComponets/ui/editor/HtmlContentParser';

const getBlogData = async(slug:string)=>{
 // You can fetch data here on the server
 try {
     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${slug}`);
  const data = await res.json();
  return data;
 } catch (error) {
    console.log(error, ' Error fetching data')
 }
  return null;
}



export default async function SingleBlogPage ({params}) {
const {slug} = await params;

const data = await getBlogData(slug)
 if(!data) return <NoBlogFoundMsg />
  return (
  <main className="w-full z-0">
      <section className={`w-full min-h-screen z-0 flex relative mb-8 md:mb-10 lg:mb-14 xl:mb-16 2xl:mb-18`}>
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-[1000px] text-center bg-slate-800/30 rounded-[10px] p-2">
            <h1 className="!text-white wt_text-shadow wt_fs-7xl font-medium heading !leading-[100%]">
              Our Blog
            </h1>
            <p className="!text-white wt_text-shadow wt_fs-xl bold mt-5">
              Experience the synergy of design and technology. As a full-service digital partner, we bring your brand to life through transformative digital solutions and captivating experiences
            </p>
            {/* Display the dynamic blog id */}
            <div className="mt-6 text-white">
              Blog ID: {slug}
            </div>
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
      <section className='w-full wt_parser_content'>
          <Container>
            <HtmlContentParser htmlContent={data?.post?.content} />
          </Container>
      </section>
    </main>
  )
}
