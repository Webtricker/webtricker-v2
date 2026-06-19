"use client";

import TeamForm, {
  TeamFormValues,
  emptyTeamValues,
} from "../components/TeamForm";
import { Button } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function TeamMemberAddPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: TeamFormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add team member");
      }

      toast.success("Team member added");
      router.push("/settings/teams");
    } catch (error: any) {
      toast.error(error?.message || "Failed to add team member");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Add Team Member
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Create a reusable team profile.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/settings/teams">Back</Link>
        </Button>
      </div>

      <TeamForm
        title="Team Member Details"
        description="Profile image, name, role, and optional social details."
        initialValues={emptyTeamValues}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
