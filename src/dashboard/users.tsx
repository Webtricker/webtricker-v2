"use client";

import MediaModal from "@/sharedComponets/ui/editor/MediaModal";
import { toggleModal } from "@/redux/features/modalToggler/ModalTogglerSlice";
import type { TMedia } from "@/types/commonTypes";
import React from "react";
import { useDispatch } from "react-redux";
import { Button, Card, CardContent, CardHeader, Skeleton, Badge } from "./ui";
import { getLightRoleBadgeClass, type DashboardUser } from "./auth";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: "superAdmin" | "editor" | "intern" | "admin";
  avatar?: string;
  isActive: boolean;
  createdAt?: string;
  lastLogin?: string;
};

export const roleLabel = (role: string) =>
  role === "superAdmin" ? "superAdmin" : role;

export const UserAvatar = ({
  user,
  className = "h-10 w-10",
}: {
  user: Pick<UserRecord, "name" | "email" | "avatar">;
  className?: string;
}) => {
  const label = user.name || user.email || "U";

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={label}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} grid rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-950 place-items-center`}
    >
      {label.charAt(0).toUpperCase()}
    </div>
  );
};

export const RoleBadge = ({ role }: { role: string }) => (
  <Badge className={getLightRoleBadgeClass(role)}>{roleLabel(role)}</Badge>
);

export const StatusBadge = ({ active }: { active: boolean }) => (
  <Badge
    className={
      active
        ? "border-emerald-200 bg-emerald-50 !text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:!text-emerald-100"
        : "border-zinc-200 bg-zinc-50 !text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:!text-zinc-300"
    }
  >
    {active ? "Active" : "Inactive"}
  </Badge>
);

export const formatLastLogin = (value?: string) => {
  if (!value) return "Never";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const UsersSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={index} className="h-16 w-full" />
    ))}
  </div>
);

type UserFormValues = {
  name: string;
  email: string;
  password: string;
  role: "editor" | "intern";
  avatar: string;
  isActive: boolean;
};

type UserFormProps = {
  currentUser: DashboardUser;
  initialUser?: UserRecord;
  mode: "add" | "edit";
  submitting: boolean;
  onSubmit: (values: UserFormValues) => void;
};

const modalKey = "OPEN_DASHBOARD_USER_AVATAR_MODAL";

export const UserForm = ({
  currentUser,
  initialUser,
  mode,
  submitting,
  onSubmit,
}: UserFormProps) => {
  const dispatch = useDispatch();
  const editingSelf = mode === "edit" && initialUser?.id === currentUser.id;
  const [values, setValues] = React.useState<UserFormValues>({
    name: initialUser?.name || "",
    email: initialUser?.email || "",
    password: "",
    role:
      initialUser?.role === "editor" || initialUser?.role === "intern"
        ? initialUser.role
        : "intern",
    avatar: initialUser?.avatar || "",
    isActive: initialUser?.isActive ?? true,
  });

  const updateValue = <Key extends keyof UserFormValues>(
    key: Key,
    value: UserFormValues[Key]
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleAvatarSelect = (media: TMedia) => {
    updateValue("avatar", media.secure_url);
    dispatch(toggleModal(null));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            {mode === "add" ? "Invite User" : "Edit User"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {mode === "add"
              ? "Create an editor or intern account."
              : "Update this team member's dashboard access."}
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit(values);
            }}
          >
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <input
                required
                value={values.name}
                onChange={(event) => updateValue("name", event.target.value)}
                className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                required
                type="email"
                value={values.email}
                onChange={(event) => updateValue("email", event.target.value)}
                className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Password</label>
              <input
                required={mode === "add"}
                type="password"
                value={values.password}
                placeholder={
                  mode === "edit" ? "Leave blank to keep current password" : ""
                }
                onChange={(event) =>
                  updateValue("password", event.target.value)
                }
                className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Role</label>
              <select
                value={values.role}
                disabled={editingSelf}
                onChange={(event) =>
                  updateValue("role", event.target.value as "editor" | "intern")
                }
                className="min-h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <option value="editor">editor</option>
                <option value="intern">intern</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Avatar</label>
              <div className="flex flex-wrap items-center gap-3">
                <UserAvatar
                  user={{
                    name: values.name,
                    email: values.email,
                    avatar: values.avatar,
                  }}
                />
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => dispatch(toggleModal(modalKey))}
                >
                  Choose from Media Library
                </Button>
                {values.avatar && (
                  <button
                    type="button"
                    onClick={() => updateValue("avatar", "")}
                    className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.isActive}
                onChange={(event) =>
                  updateValue("isActive", event.target.checked)
                }
              />
              Active
            </label>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : mode === "add"
                    ? "Invite User"
                    : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <MediaModal
        activeKey={modalKey}
        allowedMediaTypeToShow={["img"]}
        cb={handleAvatarSelect}
      />
    </>
  );
};
