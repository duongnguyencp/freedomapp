// FreedomPath design system.
// Premium, minimal, calm, modern, financial. Keep it small on purpose —
// this is the single source of truth for colors, spacing and type.

export const colors = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  border: '#E9EBEF',

  textPrimary: '#0B1220',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  accent: '#0F62FE', // confident, calm blue — "financial" without being loud
  accentSoft: '#E8F0FE',

  success: '#16A34A',
  successSoft: '#E8F6ED',

  track: '#EEF0F4',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  hero: { fontSize: 44, fontWeight: '700' as const, letterSpacing: -1 },
  title: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  label: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.4 },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
};
