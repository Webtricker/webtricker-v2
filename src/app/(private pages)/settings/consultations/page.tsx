"use client";

import { Badge, Button, Card, CardContent } from "@/dashboard/ui";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget?: string;
  message?: string;
  startAt: string;
  timezone: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
};

type Filter = "upcoming" | "past" | "cancelled" | "all";

export default function ConsultationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [officeTz, setOfficeTz] = useState("UTC");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/consultations", { cache: "no-store", credentials: "include" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Failed to load bookings");
      setBookings(json.bookings);
      setOfficeTz(json.timezone);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: Booking["status"]) => {
    if (status === "cancelled" && !window.confirm("Cancel this consultation and email the visitor?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Update failed");
      toast.success("Booking updated");
      await load();
    } catch (err: any) {
      toast.error(err?.message || "Update failed");
    } finally {
      setBusyId("");
    }
  };

  const now = Date.now();
  const visible = bookings
    .filter((b) => {
      const future = new Date(b.startAt).getTime() > now;
      if (filter === "upcoming") return b.status === "confirmed" && future;
      if (filter === "past") return b.status !== "cancelled" && !future;
      if (filter === "cancelled") return b.status === "cancelled";
      return true;
    })
    .sort((a, b) =>
      filter === "upcoming"
        ? new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        : new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
    );

  const fmt = (iso: string, tz: string) =>
    new Intl.DateTimeFormat("en-US", { timeZone: tz, dateStyle: "medium", timeStyle: "short" }).format(
      new Date(iso)
    );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Free consultations
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Bookings from the public scheduler. Times shown in {officeTz}. Working hours are set in
            <code className="mx-1">src/data/consultation.ts</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["upcoming", "past", "cancelled", "all"] as Filter[]).map((f) => (
            <Button
              key={f}
              type="button"
              variant={filter === f ? "primary" : "secondary"}
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-4">
            <div className="h-40 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </CardContent>
        </Card>
      ) : visible.length === 0 ? (
        <Card>
          <CardContent className="pt-4 text-sm text-zinc-500">No {filter} consultations.</CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((b) => (
            <Card key={b.id}>
              <CardContent className="pt-4 flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-950 dark:text-zinc-50">
                      {fmt(b.startAt, officeTz)}
                    </p>
                    <p className="text-xs text-zinc-500">Visitor: {fmt(b.startAt, b.timezone)} ({b.timezone})</p>
                  </div>
                  <Badge className="capitalize">{b.status.replace("_", " ")}</Badge>
                </div>

                <div className="grid gap-1 text-sm sm:grid-cols-2">
                  <p><span className="text-zinc-500">Name:</span> {b.name}</p>
                  <p>
                    <span className="text-zinc-500">Email:</span>{" "}
                    <a className="underline" href={`mailto:${b.email}`}>{b.email}</a>
                  </p>
                  <p><span className="text-zinc-500">Phone:</span> {b.phone || "—"}</p>
                  <p><span className="text-zinc-500">Company:</span> {b.company || "—"}</p>
                  <p><span className="text-zinc-500">Topic:</span> {b.service}</p>
                  <p><span className="text-zinc-500">Budget:</span> {b.budget || "—"}</p>
                </div>
                {b.message ? (
                  <p className="whitespace-pre-wrap rounded-md bg-zinc-50 p-3 text-sm dark:bg-zinc-900">
                    {b.message}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {b.status === "confirmed" ? (
                    <>
                      <Button type="button" variant="secondary" disabled={busyId === b.id} onClick={() => setStatus(b.id, "completed")}>
                        Mark completed
                      </Button>
                      <Button type="button" variant="secondary" disabled={busyId === b.id} onClick={() => setStatus(b.id, "no_show")}>
                        No-show
                      </Button>
                      <Button type="button" variant="secondary" disabled={busyId === b.id} onClick={() => setStatus(b.id, "cancelled")}>
                        Cancel
                      </Button>
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
