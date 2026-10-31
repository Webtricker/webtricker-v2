"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";

type Booking = {
  name: string;
  service: string;
  startAt: string;
  timezone: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
};

export default function ManageBooking() {
  const token = useSearchParams().get("token") ?? "";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setState("missing");
      return;
    }
    fetch(`/api/consultations/manage?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error("not found");
        setBooking(json.booking);
        setState("ready");
      })
      .catch(() => setState("missing"));
  }, [token]);

  const cancel = async () => {
    if (!window.confirm("Cancel this consultation?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/consultations/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setBooking((b) => (b ? { ...b, status: "cancelled" } : b));
      toast.success("Your consultation was cancelled.");
    } catch (err: any) {
      toast.error(err?.message || "Could not cancel. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") return <LoadingSpinner className="w-8 h-8" />;

  if (state === "missing" || !booking) {
    return (
      <p>
        We couldn&apos;t find that booking. The link may be incomplete.{" "}
        <Link className="animate-underline" href="/free-consultation">Book a new time</Link>.
      </p>
    );
  }

  const when = new Intl.DateTimeFormat(undefined, {
    timeZone: booking.timezone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(booking.startAt));

  const upcoming = new Date(booking.startAt).getTime() > Date.now();

  return (
    <div className="rounded-[10px] border border-slate-300 dark:border-slate-600 p-6">
      <p>Hi {booking.name},</p>
      <p className="mt-3 text-lg font-bold">{when}</p>
      <p className="text-sm opacity-70">{booking.timezone}</p>
      <p className="mt-3">Topic: {booking.service}</p>
      <p className="mt-3">
        Status: <strong className="capitalize">{booking.status.replace("_", " ")}</strong>
      </p>

      {booking.status === "confirmed" && upcoming ? (
        <button
          onClick={cancel}
          disabled={busy}
          className="btn-reverse-bg mt-6 px-5 py-2 rounded-[4px]"
        >
          {busy ? <LoadingSpinner className="w-5 h-5" /> : "Cancel consultation"}
        </button>
      ) : null}

      {booking.status === "cancelled" ? (
        <Link className="animate-underline mt-6 inline-block" href="/free-consultation">
          Book a new time
        </Link>
      ) : null}
    </div>
  );
}
