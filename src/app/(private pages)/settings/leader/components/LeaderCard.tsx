import {
  useDeleteLeaderMutation
} from "@/redux/features/team/teamApiSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { ILeaderInfo } from "@/types/data";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type TServiceProps = {
  leaderInfo: ILeaderInfo;
  refetch: () => Promise<any> | Dispatch<SetStateAction<boolean>>;
};

export const LeaderCard = ({ leaderInfo, refetch }: TServiceProps) => {
  const [deleteLeader, { isLoading }] = useDeleteLeaderMutation();

  // handlers
  const handleDelete = async (id: string) => {
    const agreed = confirm("Are you sure you want to delete this leader?");
    if (!agreed) return;

    try {
      // Call the delete API here
      const res = await deleteLeader(id).unwrap();
      if (res.success) {
        toast.success("Leader deleted successfully");
        refetch();
      } else {
        toast.error("Failed to delete leader");
      }
    } catch (error: any) {
      console.error("Error deleting Leader:", error?.data);
      toast.error(error?.data?.message || "Failed to delete Leader");
    }
  };

  return (
    <div className="relative duration-200 flex flex-col lg:duration-500 lg:hover:scale-[1.02] overflow-hidden w-full rounded-[10px] border border-slate-300 hover:border-slate-400 dark:border-slate-600 min-h-[550px]">
      <div className="w-full h-[350px]">
        <Image
          src={leaderInfo.profile}
          width={300}
          className="w-full h-full object-cover"
          height={230}
          alt={leaderInfo.name}
        />
      </div>
      <div className="w-full  p-4 flex flex-col grow">
        <h6>Name: {leaderInfo.name}</h6>
        <p className="mt-2">Role: {leaderInfo.role}</p>
        <p className="mt-2">Facebook: {leaderInfo.facebookLink}</p>
        <p className="mt-2">Instagram: {leaderInfo.instagramLink}</p>
        <p className="mt-2">LinkedIn: {leaderInfo.linkedInLink}</p>
        <div className="w-full flex items-end grow mt-5">
          <div className="w-full flex items-center justify-between">
            {isLoading ? (
              <div className="grow flex items-center justify-end px-5">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <Link href={`/settings/leader/${leaderInfo._id}`}>
                  <Button label="Edit" className="!text-sm !py-2.5" />
                </Link>
                <Button
                  cb={() => handleDelete(leaderInfo._id)}
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
