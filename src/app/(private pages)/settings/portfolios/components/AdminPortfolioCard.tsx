import { useDeletePortfolioMutation } from "@/redux/features/portfolio/portfolioApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { TPortfolio } from "@/types/portfolio";
import { trimText } from "@/utils/blog";
import { formatDateToShortString } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type Props = {
  portfolio: TPortfolio;
  refetch: () => Promise<any> | Dispatch<SetStateAction<boolean>>;
};

export default function AdminPortfolioCard({ portfolio, refetch }: Props) {
  const [deletePortfolio, { isLoading }] = useDeletePortfolioMutation();

  // // handlers
  const handleDelete = async () => {
    const agreed = confirm("Are you sure you want to delete this portfolio?");
    if (!agreed) return;

    try {
      // Call the delete API here
      const res = await deletePortfolio(portfolio._id).unwrap();
      console.log(res, "res from delete portfilio");
      if (res.success) {
        toast.success(res.message);
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.error("Error deleting portfolio:", error?.data);
      toast.error(error?.data?.message || "Failed to delete portfolio");
    }
  };
  return (
    <div className="w-full border border-slate-200 dark:border-slate-700 h-auto rounded-[6px] overflow-hidden">
      <div className="w-full h-[230px] md:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src={portfolio.thumnail.url || ""}
          width={600}
          className="w-full h-full object-cover"
          height={400}
          alt={portfolio.title}
        />
      </div>
      <div className="w-full p-4">
        <h6 className="mb-2">{trimText(portfolio.title, 52)}</h6>
        <div className="w-full flex items-center justify-between gap-5">
          <p>{formatDateToShortString(portfolio.createdAt)}</p>
          {isLoading ? (
            <div className="grow flex items-center justify-end px-5">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <Link href={`/settings/portfolios/${portfolio.slug}`}>
                <Button label="Edit" className="!text-sm !py-2.5" />
              </Link>

              <Button
                cb={handleDelete}
                label="Delete"
                className="!text-sm !text-red-500 !py-2.5"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
