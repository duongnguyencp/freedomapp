// Local-only, single-user, offline app — we just need IDs that don't
// collide with each other, not cryptographically strong ones.
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
