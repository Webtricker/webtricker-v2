"use client";
import { useAddTeamMemberMutation } from "@/redux/features/team/teamApiSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import TeamInfoForm from "@/sharedComponets/ui/form/TeamInfoForm";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AddTeamInfo() {
  // hooks
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [addTeamMember, { isLoading }] = useAddTeamMemberMutation();

  //  handlers
  const handleSubmit = async () => {
    if (!profile) return toast.error("Please add profile");
    if (!name) return toast.error("Please enter name");
    if (!role) return toast.error("Please enter role");

    try {
      const res = await addTeamMember({ profile, name, role }).unwrap();
      if (res.success) {
        toast.success("Team member info added");
        // reset data
        setProfile("");
        setName("");
        setRole("");
      } else {
        throw new Error("Error uploading team member");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Error uploading team member");
    }
  };

  return (
    <div
      className={`w-full grow flex items-center justify-center ${
        !!isLoading && "pointer-events-none"
      }`}
    >
      <TeamInfoForm
        activeKey="OPEN_TEAM_INFO_ADD_MODAL"
        key="OPEN_TEAM_INFO_ADD_MODAL_WRAPPER"
        name={name}
        setName={setName}
        role={role}
        setRole={setRole}
        profile={profile}
        setProfile={setProfile}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Button
            disabled={!profile || !name || !role}
            label="Save"
            cb={handleSubmit}
            className="!py-2.5 wt_fs-md"
          />
        )}
      </TeamInfoForm>
    </div>
  );
}
