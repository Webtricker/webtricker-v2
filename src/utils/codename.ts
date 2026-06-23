const ADJECTIVES = [
  'Curious', 'Swift', 'Bright', 'Calm', 'Bold', 'Wise', 'Kind', 'Sharp',
  'Quiet', 'Brave', 'Cool', 'Keen', 'Fair', 'Warm', 'Eager', 'Agile',
  'Crisp', 'Deft', 'Lively', 'Nimble',
];
const NOUNS = [
  'Falcon', 'Tiger', 'Eagle', 'Panda', 'Hawk', 'Wolf', 'Bear', 'Fox',
  'Owl', 'Deer', 'Lion', 'Crane', 'Robin', 'Lynx', 'Swan', 'Raven',
  'Gecko', 'Moose', 'Bison', 'Finch',
];

export function getCodename(sessionId: string): string {
  const hex = sessionId.replace(/-/g, '');
  const adj = parseInt(hex.slice(0, 4), 16) % ADJECTIVES.length;
  const noun = parseInt(hex.slice(4, 8), 16) % NOUNS.length;
  return `${ADJECTIVES[adj]} ${NOUNS[noun]}`;
}
