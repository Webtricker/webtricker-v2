"use client";

import { getCurrentDashboardUser } from "@/dashboard/auth";
import {
  formatLastLogin,
  RoleBadge,
  StatusBadge,
  UserAvatar,
  UserRecord,
  UsersSkeleton,
} from "@/dashboard/users";
import { Button, Card, CardContent, CardHeader } from "@/dashboard/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function UsersPage() {
  const router = useRouter();
  const currentUser = useMemo(() => getCurrentDashboardUser(), []);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteUser, setDeleteUser] = useState<UserRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role !== "superAdmin") router.replace("/settings");
  }, [currentUser, router]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "superAdmin") return;

    let mounted = true;

    const loadUsers = async () => {
      try {
        const response = await fetch("/api/users", {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load users");
        }

        if (mounted) setUsers(data.users || []);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const handleDelete = async () => {
    if (!deleteUser) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/users/${deleteUser.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete user");
      }

      setUsers((current) => current.filter((user) => user.id !== deleteUser.id));
      setDeleteUser(null);
      toast.success("User deleted");
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (!currentUser || currentUser.role !== "superAdmin") return null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Users
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage dashboard access for Webtricker team members.
          </p>
        </div>
        <Button asChild>
          <Link href="/settings/users/add">Invite User</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            All Users
          </h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <UsersSkeleton />
          ) : users.length === 0 ? (
            <div className="rounded-md border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              No users found. Add your first team member.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  <tr>
                    <th className="px-3 py-3 font-medium">Avatar</th>
                    <th className="px-3 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Email</th>
                    <th className="px-3 py-3 font-medium">Role</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Last Login</th>
                    <th className="px-3 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {users.map((user) => {
                    const isSelf = user.id === currentUser.id;

                    return (
                      <tr key={user.id}>
                        <td className="px-3 py-4">
                          <UserAvatar user={user} />
                        </td>
                        <td className="px-3 py-4 font-medium text-zinc-950 dark:text-zinc-50">
                          {user.name}
                        </td>
                        <td className="px-3 py-4 text-zinc-500 dark:text-zinc-400">
                          {user.email}
                        </td>
                        <td className="px-3 py-4">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge active={user.isActive} />
                        </td>
                        <td className="px-3 py-4 text-zinc-500 dark:text-zinc-400">
                          {formatLastLogin(user.lastLogin)}
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex justify-end gap-2">
                            <Button asChild variant="secondary">
                              <Link href={`/settings/users/${user.id}`}>
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="secondary"
                              disabled={isSelf}
                              onClick={() => setDeleteUser(user)}
                              className="disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {deleteUser && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              Delete user?
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              This will remove {deleteUser.name}'s dashboard access.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setDeleteUser(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
