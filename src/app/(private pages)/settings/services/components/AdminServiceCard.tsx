import { useDeleteServiceMutation } from "@/redux/features/post/postApi";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { IService } from "@/types/post";
import { trimText } from "@/utils/blog";
import { formatDateToShortString } from "@/utils/date";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type TServiceProps = {
  service: IService;
  refetch: () => Promise<any> | Dispatch<SetStateAction<boolean>>;
};

export const AdminServiceCard = ({ service, refetch }: TServiceProps) => {
  const [deleteService, { isLoading }] = useDeleteServiceMutation();

  // handlers
  const handleDelete = async (serviceId: string) => {
    const agreed = confirm("Are you sure you want to delete this blog?");
    if (!agreed) return;

    try {
      // Call the delete API here
      const res = await deleteService(serviceId).unwrap();
      console.log(res, "res from delete service");
      if (res.success) {
        toast.success("Service deleted successfully");
        refetch(); // Refetch the Services after deletion
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error: any) {
      console.error("Error deleting service:", error?.data);
      toast.error(error?.data?.message || "Failed to delete service");
    }
  };

  return (
    <div className="relative duration-200 flex flex-col lg:duration-500 lg:hover:scale-[1.02] overflow-hidden w-full rounded-[10px] border border-slate-300 hover:border-slate-400 dark:border-slate-600 min-h-[500px]">
      <div className="w-full h-[230px]">
        <Image
          src={service.thumnail.url}
          width={300}
          className="w-full h-full object-cover"
          height={230}
          alt={service.title}
        />
      </div>
      <div className="w-full  p-4 flex flex-col grow">
        <h6>{trimText(service.category, 52)}</h6>
        <p className="mt-2">
          {trimText(service.excerp ? service.excerp : service.description, 133)}
        </p>
        <div className="w-full flex items-end grow">
          <div className="w-full flex items-center justify-between">
            <p>{formatDateToShortString(service.createdAt)}</p>
            {isLoading ? (
              <div className="grow flex items-center justify-end px-5">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <Link href={`/settings/services/${service.slug}`}>
                  <Button label="Edit" className="!text-sm !py-2.5" />
                </Link>
                <Button
                  cb={() => handleDelete(service._id)}
                  label="Delete"
                  className="!text-sm !py-2.5 !text-red-500"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
