"use client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "@/sharedComponets/ui/loading/LoadingSpinner";
import { useBotCheck } from "@/sharedComponets/ui/security/useBotCheck";

type Day = { date: string; slots: string[] };
type Availability = {
  timezone: string;
  durationMinutes: number;
  services: string[];
  budgets: string[];
  days: Day[];
};

const inputClass =
  "cursor-hide block wt_fs-md w-full py-1.5 mt-1.5 px-4 rounded-[4px] outline-none duration-200 border border-slate-300 focus:border-slate-500 dark:focus:border-slate-300 dark:border-slate-400";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingScheduler() {
  const [tz, setTz] = useState("UTC");
  const [data, setData] = useState<Availability | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [monthKey, setMonthKey] = useState(""); // "YYYY-MM" in the visitor's timezone
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState<{ startAt: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  });
  const bot = useBotCheck();

  const loadAvailability = async () => {
    setLoadError(false);
    try {
      const res = await fetch("/api/consultations/availability", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error("unavailable");
      setData(json);
    } catch {
      setLoadError(true);
    }
  };

  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    void loadAvailability();
  }, []);

  // Group every open slot by the visitor's local calendar date.
  const slotsByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    const dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: tz });
    for (const day of data?.days ?? []) {
      for (const iso of day.slots) {
        const key = dateFmt.format(new Date(iso));
        map.set(key, [...(map.get(key) ?? []), iso]);
      }
    }
    return map;
  }, [data, tz]);

  // Start on the month of the first available day.
  useEffect(() => {
    if (!monthKey && slotsByDate.size > 0) {
      setMonthKey([...slotsByDate.keys()].sort()[0].slice(0, 7));
    }
  }, [slotsByDate, monthKey]);

  const months = useMemo(
    () => [...new Set([...slotsByDate.keys()].map((d) => d.slice(0, 7)))].sort(),
    [slotsByDate]
  );

  const timeLabel = (iso: string) =>
    new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));

  const longLabel = (iso: string) =>
    new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(iso));

  // Calendar grid for the visible month
  const [year, month] = monthKey ? monthKey.split("-").map(Number) : [0, 0];
  const firstWeekday = monthKey ? new Date(Date.UTC(year, month - 1, 1)).getUTCDay() : 0;
  const daysInMonth = monthKey ? new Date(Date.UTC(year, month, 0)).getUTCDate() : 0;
  const monthIdx = months.indexOf(monthKey);

  const onPickDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot("");
  };

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return toast.error("Please choose a date and time.");
    if (!bot.isAnswered) return toast.error("Please answer the security question.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startAt: selectedSlot,
          timezone: tz,
          ...bot.getPayload(),
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setBooked({ startAt: json.booking.startAt });
        return;
      }
      toast.error(json.message || "Could not book that time. Please try again.");
      if (json.slotTaken) {
        setSelectedSlot("");
        void loadAvailability();
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
      void bot.refresh();
    }
  };

  if (booked) {
    return (
      <div
        role="status"
        className="w-full rounded-[10px] border border-slate-300 dark:border-slate-600 p-6 md:p-8"
      >
        <h2 className="heading !text-2xl">You&apos;re booked!</h2>
        <p className="mt-3">
          Your free {data?.durationMinutes ?? 30}-minute consultation is confirmed for:
        </p>
        <p className="mt-2 text-lg font-bold">{longLabel(booked.startAt)}</p>
        <p className="text-sm opacity-70">{tz}</p>
        <p className="mt-4">
          We just emailed you a confirmation with a calendar invite and a link to
          cancel or change the time. We will send the meeting link before the call.
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full rounded-[10px] border border-slate-300 p-6">
        <p>We couldn&apos;t load the calendar right now.</p>
        <button onClick={() => void loadAvailability()} className="btn-reverse-bg mt-3 px-4 py-2 rounded-[4px]">
          Try again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center py-16">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    );
  }

  if (slotsByDate.size === 0) {
    return (
      <div className="w-full rounded-[10px] border border-slate-300 p-6">
        <p>
          All consultation times are currently taken. Please check back soon or{" "}
          <a className="animate-underline" href="/contact">send us a message</a>.
        </p>
      </div>
    );
  }

  const slots = selectedDate ? slotsByDate.get(selectedDate) ?? [] : [];

  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-8">
      <div className="w-full grid gap-8 lg:grid-cols-2">
        {/* ===== calendar ===== */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="heading !text-xl">
              {monthKey
                ? new Intl.DateTimeFormat(undefined, {
                    timeZone: "UTC",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(Date.UTC(year, month - 1, 1)))
                : ""}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous month"
                disabled={monthIdx <= 0}
                onClick={() => setMonthKey(months[monthIdx - 1])}
                className="px-3 py-1 rounded-[4px] border border-slate-300 dark:border-slate-500 disabled:opacity-30"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next month"
                disabled={monthIdx === -1 || monthIdx >= months.length - 1}
                onClick={() => setMonthKey(months[monthIdx + 1])}
                className="px-3 py-1 rounded-[4px] border border-slate-300 dark:border-slate-500 disabled:opacity-30"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1 font-bold opacity-60">
                {d}
              </div>
            ))}
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = `${monthKey}-${String(i + 1).padStart(2, "0")}`;
              const available = slotsByDate.has(date);
              const active = selectedDate === date;
              return (
                <button
                  key={date}
                  type="button"
                  disabled={!available}
                  onClick={() => onPickDate(date)}
                  aria-pressed={active}
                  aria-label={`${date}${available ? "" : " (no times available)"}`}
                  className={`py-2 rounded-[6px] duration-150 ${
                    active
                      ? "btn-reverse-bg"
                      : available
                      ? "border border-slate-400 hover:border-slate-900 dark:hover:border-white font-bold"
                      : "opacity-30 cursor-not-allowed"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm opacity-70">
            Times shown in your timezone: <strong>{tz}</strong>
          </p>
        </div>

        {/* ===== time slots ===== */}
        <div>
          <h2 className="heading !text-xl mb-3">
            {selectedDate ? "Pick a time" : "Choose a date first"}
          </h2>
          {selectedDate ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slots.map((iso) => (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedSlot(iso)}
                  aria-pressed={selectedSlot === iso}
                  className={`py-2 rounded-[6px] border duration-150 ${
                    selectedSlot === iso
                      ? "btn-reverse-bg"
                      : "border-slate-400 hover:border-slate-900 dark:hover:border-white"
                  }`}
                >
                  {timeLabel(iso)}
                </button>
              ))}
            </div>
          ) : (
            <p className="opacity-70">Days with open times are highlighted on the calendar.</p>
          )}
          {selectedSlot ? (
            <p className="mt-4 font-bold">{longLabel(selectedSlot)}</p>
          ) : null}
        </div>
      </div>

      {/* ===== details ===== */}
      {selectedSlot ? (
        <div className="w-full grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="bkName">Your name *</label>
            <input id="bkName" required maxLength={100} className={inputClass} value={form.name} onChange={set("name")} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="bkEmail">Email *</label>
            <input id="bkEmail" required type="email" maxLength={254} className={inputClass} value={form.email} onChange={set("email")} autoComplete="email" />
          </div>
          <div>
            <label htmlFor="bkPhone">Phone / WhatsApp</label>
            <input id="bkPhone" type="tel" maxLength={30} className={inputClass} value={form.phone} onChange={set("phone")} autoComplete="tel" />
          </div>
          <div>
            <label htmlFor="bkCompany">Company</label>
            <input id="bkCompany" maxLength={120} className={inputClass} value={form.company} onChange={set("company")} autoComplete="organization" />
          </div>
          <div>
            <label htmlFor="bkService">What do you need help with? *</label>
            <select id="bkService" required className={inputClass} value={form.service} onChange={set("service")}>
              <option value="">Select…</option>
              {data.services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="bkBudget">Estimated budget</label>
            <select id="bkBudget" className={inputClass} value={form.budget} onChange={set("budget")}>
              <option value="">Prefer not to say</option>
              {data.budgets.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="bkMessage">Tell us about your project</label>
            <textarea id="bkMessage" maxLength={2000} className={`${inputClass} min-h-[110px]`} value={form.message} onChange={set("message")} />
          </div>
          <div className="md:col-span-2 relative">{bot.element}</div>
          <div className="md:col-span-2">
            <button
              disabled={submitting}
              className="w-full btn-reverse-bg py-2 wt_fs-md px-2 rounded-[4px]"
            >
              {submitting ? (
                <LoadingSpinner className="w-6 h-6 mx-auto my-1" />
              ) : (
                <span>Confirm free consultation</span>
              )}
            </button>
            <p className="mt-2 text-sm opacity-70">
              Free, {data.durationMinutes} minutes, no obligation. You can cancel any time from the confirmation email.
            </p>
          </div>
        </div>
      ) : null}
    </form>
  );
}
