export function makeExcerpt(sentence:string) {
  const trimmedStartSentence = sentence.trimStart().trimEnd();
  const lowercasedSentence = trimmedStartSentence.toLowerCase();
  const formattedSentence = lowercasedSentence.replace(/\s+/g, '-');
  return formattedSentence;
}
