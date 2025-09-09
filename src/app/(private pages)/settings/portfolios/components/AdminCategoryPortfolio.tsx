"use client";
import { useGetPortfoliosQuery } from "@/redux/features/portfolio/portfolioApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import Container from "@/sharedComponets/ui/wrapper/Container";
import { ITechnology } from "@/types/data";
import { TPortfolio } from "@/types/portfolio";
import Link from "next/link";
import AdminPortfolioCard from "./AdminPortfolioCard";

export default function AdminCategoryPortfolio({
  technology,
  limit = 7,
}: {
  technology: ITechnology;
  limit?: number
}) {

  const { data, isLoading, isError, error, refetch } = useGetPortfoliosQuery({
    technologyId: technology._id,
    page: 1,
    limit,
  });

  // conditional rendering
  if (isLoading) {
    return (
      <Container className="section-speacing flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </Container>
    );
  }

  if (!data || !data?.portfolios?.length || isError) {
    console.log(error);
    return <></>;
  }

  return (
    <Container className="section-speacing">
      <div className="w-full flex items-center justify-between gap-4 flex-wrap lg:gap-10">
        <h4>{technology.name}</h4>

        {data.portfolios?.length > 6 ? (
          <Link href={`/settings/portfolio-technologies/${technology._id}`}>
            <Button label="Show All" className="!py-2.5 lg:!py-3" />
          </Link>
        ) : (
          <></>
        )}
      </div>
      <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
        {data.portfolios.slice(0, 6).map((portfolio: TPortfolio) => (
          <AdminPortfolioCard refetch={refetch} key={portfolio._id} portfolio={portfolio} />
        ))}
      </div>
    </Container>
  );
}
