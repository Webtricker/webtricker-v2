"use client";
import { useAddTestimonialMutation } from "@/redux/features/testimonials/testimonialsApiSlice";
import Button from "@/sharedComponets/ui/buttons/Button";
import TeamInfoForm from "@/sharedComponets/ui/form/TeamInfoForm";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AddTestimonial() {
  // hooks
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [review, setReview] = useState("");
  const [addTestimonial, { isLoading }] = useAddTestimonialMutation();

  //  handlers
  const handleSubmit = async () => {
    if (!profile) return toast.error("Please add profile");
    if (!name) return toast.error("Please enter name");
    if (!role) return toast.error("Please enter role");
    if (!review) return toast.error("Please enter review");

    try {
      const res = await addTestimonial({ profile, name, role,review }).unwrap();
      if (res.success) {
        toast.success("Testimonial info added");
        // reset data
        setProfile("");
        setName("");
        setRole("");
        setReview("");
      } else {
        throw new Error("Error uploading testimonial");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Error uploading Testimonial");
    }
  };

  return (
    <div
      className={`w-full grow flex items-center justify-center ${
        !!isLoading && "pointer-events-none"
      }`}
    >
      <TeamInfoForm
        className="flex flex-wrap xl:flex-nowrap gap-10 max-w-[1000px]"
        activeKey="OPEN_TESTIMONIAL_INFO_ADD_MODAL"
        key="OPEN_TESTIMONIAL_INFO_ADD_MODAL_WRAPPER"
        name={name}
        setName={setName}
        imgContainerStyle="max-w-[250px] max-h-[250px]"
        imgStyle="h-[250px]"
        role={role}
        setRole={setRole}
        profile={profile}
        setProfile={setProfile}
      >
        <div className="w-full">
          <div className="w-full">
            <label htmlFor="review" className="mb-1 block wt_fs-md">
              Review
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              name="review"
              placeholder="Enter review"
              className="wt_fs-md min-h-[300px] px-4 py-2.5 lg:py-3 border outline-none border-slate-300 hover:border-slate-500 rounded-[10px] w-full"
            />
          </div>
          <div className="w-full flex items-center justify-center min-h-[44px] mt-5">
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
          </div>
        </div>
      </TeamInfoForm>
    </div>
  );
}
