import { CONSULTATION } from "@/data/consultation";
import dbConnect from "@/lib/dbConnect";
import Consultation from "@/models/Consultation";

// ---- timezone helpers (no date library needed) -----------------------------

const formatterCache = new Map<string, Intl.DateTimeFormat>();
const formatterFor = (tz: string) => {
  let fmt = formatterCache.get(tz);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatterCache.set(tz, fmt);
  }
  return fmt;
};

/** Offset (ms) of `tz` from UTC at the instant `ts`. */
const tzOffsetMs = (tz: string, ts: number): number => {
  const parts: Record<string, string> = {};
  for (const p of formatterFor(tz).formatToParts(new Date(ts))) parts[p.type] = p.value;
  const asUtc = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour,
    +parts.minute,
    +parts.second
  );
  return asUtc - Math.floor(ts / 1000) * 1000;
};

/** Wall-clock `date` + `time` in `tz` -> the real UTC instant. */
export const zonedToUtc = (date: string, time: string, tz: string): Date => {
  const [y, m, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const first = guess - tzOffsetMs(tz, guess);
  return new Date(guess - tzOffsetMs(tz, first));
};

export const isValidTimezone = (tz: unknown): tz is string => {
  if (typeof tz !== "string" || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

/** "YYYY-MM-DD" for an instant, read in `tz`. */
export const dateInZone = (ts: number, tz: string): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date(ts));

const addDays = (date: string, days: number): string => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

const weekdayOf = (date: string): number => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
};

const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const pad = (n: number) => String(n).padStart(2, "0");
const fromMinutes = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

// ---- availability ----------------------------------------------------------

export type DayAvailability = { date: string; slots: string[] };

/** All slot start times (ISO UTC) the schedule allows for one calendar day, ignoring bookings. */
const slotsForDate = (date: string, now: number): string[] => {
  const { timezone, hours, blockedDates, slotStepMinutes, durationMinutes, minNoticeHours } =
    CONSULTATION;
  if ((blockedDates as readonly string[]).includes(date)) return [];

  const earliest = now + minNoticeHours * 3600_000;
  const out: string[] = [];
  for (const [open, close] of hours[weekdayOf(date)] ?? []) {
    for (
      let t = toMinutes(open);
      t + durationMinutes <= toMinutes(close);
      t += slotStepMinutes
    ) {
      const start = zonedToUtc(date, fromMinutes(t), timezone);
      if (start.getTime() >= earliest) out.push(start.toISOString());
    }
  }
  return out;
};

/** Open slots for the next `maxDaysAhead` days, with already-booked times removed. */
export async function getAvailability(): Promise<DayAvailability[]> {
  const { timezone, maxDaysAhead, durationMinutes } = CONSULTATION;
  const now = Date.now();
  const today = dateInZone(now, timezone);

  const dates = Array.from({ length: maxDaysAhead + 1 }, (_, i) => addDays(today, i));
  const days = dates.map((date) => ({ date, slots: slotsForDate(date, now) }));

  const all = days.flatMap((d) => d.slots);
  if (all.length === 0) return days;

  await dbConnect();
  const booked = await Consultation.find({
    status: "confirmed",
    startAt: { $gte: new Date(all[0]), $lte: new Date(all[all.length - 1]) },
  })
    .select("startAt endAt")
    .lean();

  const blocks = (booked as unknown as { startAt: Date; endAt: Date }[]).map((b) => [
    b.startAt.getTime(),
    b.endAt.getTime(),
  ]);
  const lengthMs = durationMinutes * 60_000;

  return days.map((day) => ({
    date: day.date,
    slots: day.slots.filter((iso) => {
      const s = new Date(iso).getTime();
      return !blocks.some(([bs, be]) => s < be && s + lengthMs > bs);
    }),
  }));
}

/** True only for a start time the schedule offers right now and nobody has taken. */
export async function isSlotOpen(startIso: string): Promise<boolean> {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return false;
  const iso = start.toISOString();
  const days = await getAvailability();
  return days.some((d) => d.slots.includes(iso));
}
