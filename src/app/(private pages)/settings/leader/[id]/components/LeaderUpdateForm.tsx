"use client";
import {
  useUpdateLeaderInfoMutation
} from "@/redux/features/team/teamApiSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import LeaderForm from "@/sharedComponets/ui/form/LeaderForm";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { ILeaderInfo } from "@/types/data";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  member: ILeaderInfo;
}

export default function LeaderUpdateForm({ member }: Props) {
  // hooks
  const [profile, setProfile] = useState(member.profile);
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [facebookLink, setFacebookLink] = useState(member.facebookLink);
  const [instagramLink, setInstagramLink] = useState(member.instagramLink);
  const [linkedInLink, setLinkedInLink] = useState(member.linkedInLink);
  const [updateLeader, { isLoading }] = useUpdateLeaderInfoMutation();

  //  handlers
  const handleSubmit = async () => {
    if (!profile) return toast.error("Please add profile");
    if (!name) return toast.error("Please enter name");
    if (!role) return toast.error("Please enter role");
    if (!facebookLink)
      return toast.error("Please enter a Facebook profile URL.");
    if (!instagramLink)
      return toast.error("Please enter an Instagram profile URL.");
    if (!linkedInLink)
      return toast.error("Please enter a LinkedIn profile URL.");

    try {
      const res = await updateLeader({
        id: member._id,
        data: { profile, name, role },
      }).unwrap();
      if (res.success) {
        toast.success("Leader member info updated");
      } else {
        throw new Error(res?.message || "Error updating leader");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || "Error updating leader");
    }
  };

  const shouldDisable =
    member.profile === profile &&
    member.name === name &&
    member.role === role &&
    member.facebookLink === facebookLink &&
    member.instagramLink === instagramLink &&
    member.linkedInLink === linkedInLink;
  return (
    <div
      className={`w-full grow flex items-center justify-center ${
        !!isLoading && "pointer-events-none"
      }`}
    >
      <LeaderForm
        activeKey="OPEN_LEADER_INFO_UPDATE_MODAL"
        key="OPEN_LEADER_INFO_UPDATE_MODAL_WRAPPER"
        name={name}
        setName={setName}
        role={role}
        setRole={setRole}
        profile={profile}
        setProfile={setProfile}
        facebookLink={facebookLink}
        setFaceebookLink={setFacebookLink}
        instagramLink={instagramLink}
        setInstagramLink={setInstagramLink}
        linkedInLink={linkedInLink}
        setLinkedInLink={setLinkedInLink}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Button
            disabled={
              !profile ||
              !name ||
              !role ||
              !facebookLink ||
              !instagramLink ||
              !linkedInLink ||
              shouldDisable
            }
            label="Update"
            cb={handleSubmit}
            className="!py-2.5 wt_fs-md"
          />
        )}
      </LeaderForm>
    </div>
  );
}
