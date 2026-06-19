"use client";

import { useCurrentDashboardUser } from "@/dashboard/auth";
import { Button, Card, CardContent } from "@/dashboard/ui";
import { UserForm, UserRecord, UsersSkeleton } from "@/dashboard/users";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user: currentUser, loading: userLoading } = useCurrentDashboardUser();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userLoading || !currentUser) return;
    if (currentUser.role !== "superAdmin") router.replace("/settings");
  }, [currentUser, router, userLoading]);

  useEffect(() => {
    if (userLoading || !currentUser || currentUser.role !== "superAdmin") return;

    let mounted = true;

    const loadUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load user");
        }

        if (mounted) setUser(data.user);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load user");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [currentUser, params.id, userLoading]);

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
            Edit User
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Update dashboard account details.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/settings/users">Back</Link>
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-4">
            <UsersSkeleton />
          </CardContent>
        </Card>
      ) : user ? (
        <UserForm
          mode="edit"
          currentUser={currentUser}
          initialUser={user}
          submitting={submitting}
          onSubmit={async (values) => {
            setSubmitting(true);
            try {
              const payload: Record<string, unknown> = {
                name: values.name,
                email: values.email,
                avatar: values.avatar,
                isActive: values.isActive,
              };

              if (user.id !== currentUser.id) payload.role = values.role;
              if (values.password) payload.password = values.password;

              const response = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              const data = await response.json();

              if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to update user");
              }

              toast.success("User updated");
              router.push("/settings/users");
            } catch (error: any) {
              toast.error(error?.message || "Failed to update user");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      ) : (
        <Card>
          <CardContent className="pt-4 text-sm text-zinc-500 dark:text-zinc-400">
            User not found.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
