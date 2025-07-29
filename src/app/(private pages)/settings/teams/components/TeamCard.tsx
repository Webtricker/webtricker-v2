import { useDeleteTeamMemberMutation } from "@/redux/features/team/teamApiSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { ITeamInfo } from "@/types/data";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

type TServiceProps = {
  teamInfo: ITeamInfo;
  refetch: () => Promise<any> | Dispatch<SetStateAction<boolean>>;
};

export const TeamCard = ({ teamInfo, refetch }: TServiceProps) => {
  const [deleteTeamMember, { isLoading }] = useDeleteTeamMemberMutation();

  // handlers
  const handleDelete = async (id: string) => {
    const agreed = confirm("Are you sure you want to delete this member?");
    if (!agreed) return;

    try {
      // Call the delete API here
      const res = await deleteTeamMember(id).unwrap();
      if (res.success) {
        toast.success("Team member deleted successfully");
        refetch(); // Refetch the team members after deletion
      } else {
        toast.error("Failed to delete team member");
      }
    } catch (error: any) {
      console.error("Error deleting team member:", error?.data);
      toast.error(error?.data?.message || "Failed to delete team member");
    }
  };

  return (
    <div className="relative duration-200 flex flex-col lg:duration-500 lg:hover:scale-[1.02] overflow-hidden w-full rounded-[10px] border border-slate-300 hover:border-slate-400 dark:border-slate-600 min-h-[550px]">
      <div className="w-full h-[400px]">
        <Image
          src={teamInfo.profile}
          width={300}
          className="w-full h-full object-cover"
          height={230}
          alt={teamInfo.name}
        />
      </div>
      <div className="w-full  p-4 flex flex-col grow">
        <h6>Name: {teamInfo.name}</h6>
        <p className="mt-2">
          Role: {teamInfo.role}
        </p>
        <div className="w-full flex items-end grow">
          <div className="w-full flex items-center justify-between">
            {isLoading ? (
              <div className="grow flex items-center justify-end px-5">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <Link href={`/settings/teams/${teamInfo._id}`}>
                  <Button label="Edit" className="!text-sm !py-2.5" />
                </Link>
                <Button
                  cb={() => handleDelete(teamInfo._id)}
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
