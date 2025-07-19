export function makeSlug(sentence:string) {
  const trimmedStartSentence = sentence.trimStart().trimEnd();
  const lowercasedSentence = trimmedStartSentence.toLowerCase();
  const formattedSentence = lowercasedSentence.replace(/\s+/g, '-');
  return formattedSentence;
}

export function trimText(text: string, maxLength:number): string {;
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3).trimEnd() + "...";
}
