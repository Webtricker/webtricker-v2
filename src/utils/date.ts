export function formatDateToShortString(dateInput: Date | string): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid Date";

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // Jul
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
