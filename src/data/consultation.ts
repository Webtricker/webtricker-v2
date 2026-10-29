// Booking rules for the free consultation scheduler.
// Edit this file to change when and how people can book; no other code needs to change.

export const CONSULTATION = {
  /** Timezone the working hours below are written in (IANA name). */
  timezone: "Asia/Dhaka",
  durationMinutes: 30,
  /** Gap between slot start times. */
  slotStepMinutes: 30,
  /** Earliest bookable time from now. */
  minNoticeHours: 12,
  /** How far ahead the calendar shows. */
  maxDaysAhead: 30,
  /** Working hours per weekday (0 = Sunday ... 6 = Saturday), "HH:MM" in the timezone above. */
  hours: {
    0: [["10:00", "18:00"]],
    1: [["10:00", "18:00"]],
    2: [["10:00", "18:00"]],
    3: [["10:00", "18:00"]],
    4: [["10:00", "18:00"]],
    5: [],
    6: [],
  } as Record<number, [string, string][]>,
  /** Days the team is away, "YYYY-MM-DD" in the timezone above. */
  blockedDates: [] as string[],
  /** Limits that keep the form from being abused. */
  maxActiveBookingsPerEmail: 2,
  maxBookingsPerEmailPerDay: 3,
  services: [
    "Website design & development",
    "E-commerce store",
    "Custom web app / SaaS",
    "Technical SEO & performance",
    "Maintenance & security",
    "Not sure yet",
  ],
  budgets: ["Under $1,000", "$1,000 - $5,000", "$5,000 - $15,000", "$15,000+", "Not sure yet"],
} as const;

export type ConsultationStatus = "confirmed" | "cancelled" | "completed" | "no_show";
