export function formatDateToShortString(dateInput: Date | string): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid Date";

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // Jul
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}


export function formatDate(date: Date) {
  // Define an array of month abbreviations.
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Get the month and year from the Date object.
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Combine the month and year into the desired format.
  return `${month} ${year}`;
}
