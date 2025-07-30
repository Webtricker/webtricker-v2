import { useDeleteTestimonialMutation } from "@/redux/features/testimonials/testimonialsApiSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { ITestimonialsInfo } from "@/types/data";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type TServiceProps = {
  testimonial: ITestimonialsInfo;
  refetch: () => Promise<any> | Dispatch<SetStateAction<boolean>>;
};

export const TestimonialCard = ({ testimonial, refetch }: TServiceProps) => {
  const [deleteTestimonial, { isLoading }] = useDeleteTestimonialMutation();

  // handlers
  const handleDelete = async (id: string) => {
    const agreed = confirm("Are you sure you want to this data?");
    if (!agreed) return;

    try {
      // Call the delete API here
      const res = await deleteTestimonial(id).unwrap();
      if (res.success) {
        toast.success("Testimonial deleted successfully");
        refetch(); // Refetch the team members after deletion
      } else {
        toast.error("Failed to delete testimonial");
      }
    } catch (error: any) {
      console.error("Error deleting testimonial:", error?.data);
      toast.error(error?.data?.message || "Failed to delete testimonial");
    }
  };

  return (
    <div className="relative duration-200 flex flex-col lg:duration-500 lg:hover:scale-[1.02] overflow-hidden w-full rounded-[10px] border border-slate-300 hover:border-slate-400 dark:border-slate-600 min-h-[550px]">
      <div className="w-full h-[400px]">
        <Image
          src={testimonial.profile}
          width={300}
          className="w-full h-full object-cover"
          height={230}
          alt={testimonial.name}
        />
      </div>
      <div className="w-full  p-4 flex flex-col grow">
        <h6>Name: {testimonial.name}</h6>
        <p className="mt-2">
          Role: {testimonial.role}
        </p>
        <p className="mt-2">
         Review: {testimonial.review}
        </p>
        <div className="w-full flex items-end grow mt-5">
          <div className="w-full flex items-center justify-between">
            {isLoading ? (
              <div className="grow flex items-center justify-end px-5">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <Link href={`/settings/testimonials/${testimonial._id}`}>
                  <Button label="Edit" className="!text-sm !py-2.5" />
                </Link>
                <Button
                  cb={() => handleDelete(testimonial._id)}
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

