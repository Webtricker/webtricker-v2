export function makeSlug(sentence: string): string {
  return sentence
    .trim()
    .toLowerCase()
    .replace(/\s*&\s*/g, ' and ')    // "foo & bar" → "foo and bar"
    .replace(/[^a-z0-9\s-]/g, '')   // remove :, ', ,, ., ? and any other non-slug chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-{2,}/g, '-')          // collapse double hyphens
    .replace(/^-+|-+$/g, '');        // trim leading/trailing hyphens
}

// Your existing trimText function (no changes needed for this request)
export function trimText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3).trimEnd() + "...";
}