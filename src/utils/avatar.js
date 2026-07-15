const PALETTE_SIZE = 5;

export function avatarClassFor(id) {
  let hash = 0;
  for (const ch of String(id)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return `avatar-${(hash % PALETTE_SIZE) + 1}`;
}
