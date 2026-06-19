"use client";

import { Button, Card, CardContent } from "@/dashboard/ui";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TeamForm, { TeamFormValues, emptyTeamValues } from "../components/TeamForm";

const normalizeTeamValues = (team: any): TeamFormValues => ({
  ...emptyTeamValues,
  name: team?.name || "",
  role: team?.role || "",
  profile: team?.profile || "",
  profileAlt: team?.name || "",
  bio: team?.bio || "",
  linkedin: team?.linkedin || "",
});

export default function TeamMemberEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [values, setValues] = useState<TeamFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadTeamMember = async () => {
      try {
        const response = await fetch(`/api/teams/${params.id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || !data.teamData) {
          throw new Error(data.message || "Failed to load team member");
        }

        if (mounted) setValues(normalizeTeamValues(data.teamData));
      } catch (error: any) {
        toast.error(error?.message || "Failed to load team member");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadTeamMember();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  const handleSubmit = async (nextValues: TeamFormValues) => {
    setSubmitting(true);

    try {
      const response = await fetch(`/api/teams/${params.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextValues),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update team member");
      }

      toast.success("Team member updated");
      router.push("/settings/teams");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update team member");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Edit Team Member
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Update this profile.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/settings/teams">Back</Link>
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-4">
            <div className="h-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </CardContent>
        </Card>
      ) : values ? (
        <TeamForm
          title="Team Member Details"
          description="Profile image, name, role, and optional social details."
          initialValues={values}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      ) : (
        <Card>
          <CardContent className="pt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Team member not found.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
