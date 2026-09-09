import { Platform } from 'react-native';

const STORAGE_KEY = '@listes/web-build-id';

function versionUrl(): string {
  const base = (process.env.EXPO_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  return `${base}/version.json?t=${Date.now()}`;
}

export async function refreshWebBuildIfNeeded(): Promise<void> {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  try {
    const response = await fetch(versionUrl(), { cache: 'no-store' });
    if (!response.ok) return;
    const payload = (await response.json()) as { build?: string };
    const build = payload.build;
    if (!build) return;

    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (seen === build) return;

    window.localStorage.setItem(STORAGE_KEY, build);
    if (!seen) return;

    const next = new URL(window.location.href);
    next.searchParams.set('v', build.slice(0, 8));
    window.location.replace(next.toString());
  } catch {
    // Ignore: offline or first paint without version.json
  }
}
