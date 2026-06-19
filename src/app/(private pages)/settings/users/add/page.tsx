"use client";

import { useCurrentDashboardUser } from "@/dashboard/auth";
import { Button, Card, CardContent } from "@/dashboard/ui";
import { UserForm, UsersSkeleton } from "@/dashboard/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AddUserPage() {
  const router = useRouter();
  const { user: currentUser, loading: userLoading } = useCurrentDashboardUser();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userLoading || !currentUser) return;
    if (currentUser.role !== "superAdmin") router.replace("/settings");
  }, [currentUser, router, userLoading]);

  if (userLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Card>
          <CardContent className="pt-4">
            <UsersSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "superAdmin") return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Invite User
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add an editor or intern to the dashboard.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/settings/users">Back</Link>
        </Button>
      </div>

      <UserForm
        mode="add"
        currentUser={currentUser}
        submitting={submitting}
        onSubmit={async (values) => {
          setSubmitting(true);
          try {
            const response = await fetch("/api/users", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
              throw new Error(data.message || "Failed to invite user");
            }

            toast.success("User invited");
            router.push("/settings/users");
          } catch (error: any) {
            toast.error(error?.message || "Failed to invite user");
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </div>
  );
}
