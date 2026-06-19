"use client";

import DataTable from "@/dashboard/DataTable";
import { Button } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type TeamRecord = {
  id: string;
  _id: string;
  name: string;
  role: string;
  profile: string;
  bio?: string;
  linkedin?: string;
};

const normalizeTeam = (team: any): TeamRecord => ({
  id: team.id || team._id,
  _id: team._id || team.id,
  name: team.name || "",
  role: team.role || "",
  profile: team.profile || "",
  bio: team.bio || "",
  linkedin: team.linkedin || "",
});

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/teams", {
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load team members");
      }

      setTeams((data.teamData || []).map(normalizeTeam));
    } catch (error: any) {
      toast.error(error?.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "profile" as const,
        label: "Photo",
        render: (team: TeamRecord) =>
          team.profile ? (
            <img
              src={team.profile}
              alt={team.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ),
      },
      {
        key: "name" as const,
        label: "Name",
        render: (team: TeamRecord) => (
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            {team.name}
          </span>
        ),
      },
      { key: "role" as const, label: "Job Title" },
      { key: "linkedin" as const, label: "LinkedIn" },
    ],
    []
  );

  const handleDelete = async (team: TeamRecord) => {
    try {
      const response = await fetch(`/api/teams/${team._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete team member");
      }

      setTeams((current) => current.filter((item) => item._id !== team._id));
      toast.success("Team member deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete team member");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Team Members
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage people shown across the Webtricker experience.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/teams/add">Add Team Member</Link>
        </Button>
      </div>

      <DataTable<TeamRecord>
        columns={columns}
        data={teams}
        loading={loading}
        onEdit={(team) => router.push(`/settings/teams/${team._id}`)}
        onDelete={handleDelete}
        emptyMessage="No team members found. Add your first team member."
      />
    </div>
  );
}
