import PrivatePageWrapper from "@/app/(private pages)/components/PrivatePageWrapper";
import NoBlogFoundMsg from "@/app/(public pages)/blog/[slug]/components/NoBlogFoundMsg";
import { ITeamInfo } from "@/types/data";
import PageTitle from "@/app/(private pages)/components/PageTitle";
import Link from "next/link";
import Button from "@/sharedComponets/ui/buttons/Button";
import Container from "@/sharedComponets/ui/wrapper/Container";
import TestimonialUpdateForm from "./components/TestimonialUpdateForm";

const getTestimonialData = async (slug: string) => {
  // You can fetch data here on the server f
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials/${slug}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error, " Error fetching data");
  }
  return null;
};

export default async function SingleTestimonialPage({ params }) {
  const { id } = await params;

  const data = await getTestimonialData(id);
  if (!data?.testimonialData)
    return <NoBlogFoundMsg msg="No testimonial found" key="TESTIMONIAL_MSG" />;
  const testimonialData = data.testimonialData || ({} as ITeamInfo);
  return (
    <PrivatePageWrapper className="!p-0">
      <main className="w-full z-0">
        <section className=" w-full py-3 px-4 md:px-5 lg:px-10 left-0 flex items-center justify-between lg:bg-slate-100">
          <PageTitle key="UPDATE_TESTIMONIAL" title="UPDATE TESTIMONIAL" />
          <Link href="/settings/testimonials/add">
            <Button className="!py-2.5 whitespace-nowrap" label="Add Testimonial" />
          </Link>
        </section>
        <section className="section-speacing  grow">
        <Container className="w-full justify-center flex items-center">
            <TestimonialUpdateForm testimonial={testimonialData} />
        </Container>
        </section>
        </main>
    </PrivatePageWrapper>
  );
}
