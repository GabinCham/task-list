export const colors = {
  background: '#0B0B0D',
  backgroundAlt: '#1A1A1F',
  surface: '#16161A',
  ink: '#F4F4F5',
  inkMuted: '#8A8A93',
  accent: '#FF8C42',
  accentSoft: 'rgba(255, 140, 66, 0.16)',
  danger: '#FF6B6B',
  dangerSoft: 'rgba(255, 107, 107, 0.14)',
  border: '#2A2A32',
  tabBar: '#101014',
  tabInactive: '#6E6E76',
  white: '#FFFFFF',
  completed: '#6E6E76',
  checkIdle: '#5C5C64',
  plus: '#0B0B0D',
};

export const SECTION_THEMES = [
  { accent: '#FF8C42' },
  { accent: '#4CC9F0' },
  { accent: '#C77DFF' },
] as const;

export const PROGRESS_STOPS = ['#FF8C42', '#4CC9F0', '#C77DFF'] as const;

export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
