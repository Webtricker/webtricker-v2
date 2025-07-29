import { ITeamInfo } from '@/types/data';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';


export default function TeamInfoAddForm() {
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITeamInfo>();

  const submitHandler: SubmitHandler<ITeamInfo> = (data) => {
    // update team info
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-4 max-w-md p-4 border rounded"
    >
      <div>
        <label className="block font-medium">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="input"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Role</label>
        <input
          {...register("role", { required: "Role is required" })}
          className="input"
        />
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Profile Image URL</label>
        <input
          {...register("profile", { required: "Profile URL is required" })}
          className="input"
        />
        {errors.profile && <p className="text-red-500">{errors.profile.message}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Update Member
      </button>
    </form>
  );
}
