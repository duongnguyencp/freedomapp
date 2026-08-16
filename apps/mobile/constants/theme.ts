// FreedomPath design system.
// Premium, minimal, calm, modern, financial. Keep it small on purpose —
// this is the single source of truth for colors, spacing and type.
//
// Palette direction references the Starpay Figma kit (uikitfree.com) for
// its language — lavender-tinted surfaces, near-black ink for primary
// actions, a violet + warm-orange accent pair, bold rounded type — adapted
// to FreedomPath's calmer FI-tracker identity (no payment-app chrome,
// no gradients/illustration).

export const colors = {
  background: '#F5F3FB',
  surface: '#FFFFFF',
  surfaceTinted: '#EDE7FA', // hero-card wash, the "debit card" treatment
  border: '#E7E2F3',

  textPrimary: '#161528',
  textSecondary: '#6F6B85',
  textMuted: '#A29DBD',

  ink: '#161528', // near-black navy — primary buttons, active nav

  accent: '#7C5CFC', // violet — progress, primary highlights
  accentSoft: '#EDE7FA',

  warm: '#F2924D', // secondary accent — liabilities, spending-side metrics
  warmSoft: '#FCEADB',

  success: '#16A34A', // reserved semantic "good" — never a decorative series
  successSoft: '#E8F6ED',

  track: '#DCD3F2', // deliberately a step darker than surfaceTinted so the progress bar reads on the hero card too

  // Glass (frosted) surfaces — tab bar, buttons, slider track. A translucent
  // white wash + a brighter top-edge border is what reads as "glass" once
  // it's over a BlurView (tab bar) or just a flat lavender background
  // (buttons/slider, where a literal blur has nothing to blur).
  glassFill: 'rgba(255, 255, 255, 0.55)',
  glassFillStrong: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.8)',
  glassInkFill: 'rgba(22, 21, 40, 0.72)', // for the dark/primary glass button
  glassInkBorder: 'rgba(255, 255, 255, 0.18)',
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
  sm: 14,
  md: 18,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  hero: { fontSize: 44, fontWeight: '800' as const, letterSpacing: -1 },
  title: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  label: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.4 },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
};
