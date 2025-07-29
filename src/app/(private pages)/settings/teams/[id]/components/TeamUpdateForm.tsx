"use client"
import Button from '@/sharedComponets/ui/buttons/Button';
import { ITeamInfo } from '@/types/data';
import Image from 'next/image';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';

interface Props {
  member: ITeamInfo;
}

export default function TeamUpdateForm({member}:Props) {
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITeamInfo>({
    defaultValues: member,
  });

  const submitHandler: SubmitHandler<ITeamInfo> = (data) => {
    // update team info
    console.log(data, ' data from team info')
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex w-full rounded-[10px] flex-col gap-4 max-w-[400px] p-4 border"
    >
        <div className="w-full h-[400px]">
                <Image
                  src={member.profile}
                  width={300}
                  className="w-full h-full object-cover"
                  height={230}
                  alt={member.name}
                />
              </div>
      <div>
        <label className="block font-medium">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="wt_fs-md mt-1.5 px-4 py-2.5 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px] w-full"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Role</label>
         <input
          {...register("role", { required: "Role is required" })}
          className="wt_fs-md mt-1.5 px-4 py-2.5 border outline-none border-slate-400 hover:border-slate-500 rounded-[10px] w-full"
        />
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

    <Button label='Update Member' className='!py-2.5'  />
    </form>
  );
}
