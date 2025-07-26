export function makeSlug(sentence: string): string {
  // Trim leading/trailing whitespace
  const trimmedSentence = sentence.trim(); // trim() handles both start and end

  // Convert to lowercase
  const lowercasedSentence = trimmedSentence.toLowerCase();

  // Replace spaces with hyphens
  let formattedSlug = lowercasedSentence.replace(/\s+/g, '-');

  // Remove a question mark if it's at the very end of the slug
  if (formattedSlug.endsWith('?')) {
    formattedSlug = formattedSlug.slice(0, -1);
  }
  return formattedSlug;
}

// Your existing trimText function (no changes needed for this request)
export function trimText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3).trimEnd() + "...";
}