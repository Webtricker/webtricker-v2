"use client";
import { useAddLeaderMutation } from "@/redux/features/team/teamApiSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import LeaderForm from "@/sharedComponets/ui/form/LeaderForm";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AddLeader() {
  // hooks
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [addLeader, { isLoading }] = useAddLeaderMutation();

  //  handlers
  const handleSubmit = async () => {
    if (!profile) return toast.error("Please add a profile picture.");
    if (!name) return toast.error("Please enter a name.");
    if (!role) return toast.error("Please enter a role.");
    if (!facebook) return toast.error("Please enter a Facebook profile URL.");
    if (!instagram)
      return toast.error("Please enter an Instagram profile URL.");
    if (!linkedIn) return toast.error("Please enter a LinkedIn profile URL.");

    try {
      const res = await addLeader({
        profile,
        name,
        role,
        facebookLink: facebook,
        instagramLink: instagram,
        linkedInLink: linkedIn,
      }).unwrap();
      if (res.success) {
        toast.success("Leader info added");
        setProfile("");
        setName("");
        setRole("");
        setInstagram("");
        setFacebook("");
        setLinkedIn("");
      } else {
        throw new Error("Error uploading leader");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Error uploading leader");
    }
  };

  return (
    <div
      className={`w-full grow flex items-center justify-center ${
        !!isLoading && "pointer-events-none"
      }`}
    >
      <LeaderForm
        activeKey="OPEN_OUR_LEADER_ADD_MODAL"
        key="OPEN_OUR_LEADER_ADD_MODAL_WRAPPER"
        name={name}
        setName={setName}
        role={role}
        setRole={setRole}
        profile={profile}
        setProfile={setProfile}
        facebookLink={facebook}
        setFaceebookLink={setFacebook}
        instagramLink={instagram}
        setInstagramLink={setInstagram}
        linkedInLink={linkedIn}
        setLinkedInLink={setLinkedIn}
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
      </LeaderForm>
    </div>
  );
}
