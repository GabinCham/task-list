export const colors = {
  background: '#0b0f17',
  backgroundAlt: '#131a25',
  surface: '#131a25',
  foreground: '#f4f6fb',
  ink: '#f4f6fb',
  inkMuted: 'rgba(244, 246, 251, 0.5)',
  accent: '#ff7a5c',
  now: '#ff7a5c',
  later: '#6fbef6',
  someday: '#b892ff',
  accentSoft: 'rgba(255, 122, 92, 0.08)',
  danger: '#FF6B6B',
  dangerSoft: 'rgba(255, 107, 107, 0.14)',
  border: 'rgba(255, 255, 255, 0.06)',
  tabBar: '#0b0f17',
  tabInactive: 'rgba(244, 246, 251, 0.35)',
  white: '#f4f6fb',
  completed: 'rgba(244, 246, 251, 0.4)',
  checkIdle: 'rgba(244, 246, 251, 0.25)',
  plus: '#0b0f17',
};

export const SECTION_THEMES = [
  { accent: colors.now },
  { accent: colors.later },
  { accent: colors.someday },
] as const;

export const PROGRESS_STOPS = ['#ff7a5c', '#f0c07a', '#6fbef6', '#b892ff'] as const;

export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
