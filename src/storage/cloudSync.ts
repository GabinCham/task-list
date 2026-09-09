import type { AppData } from '../types';
import { supabase } from '../lib/supabase';
import { parseAppData } from './listsStorage';

export type CloudSnapshot = {
  data: AppData;
  updatedAt: string;
};

export function describeCloudError(error: unknown): string {
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String((error as { code?: string }).code)
      : '';
  const message =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message?: string }).message)
      : '';

  if (code === 'PGRST205' || message.includes('list_states')) {
    return 'La table cloud n’existe pas encore. Dans Supabase : SQL Editor → coller schema.sql → Run.';
  }
  if (message.toLowerCase().includes('failed to fetch') || message.toLowerCase().includes('network')) {
    return 'Hors ligne : tes listes restent sur cet appareil.';
  }
  return message || 'Impossible de synchroniser le cloud.';
}

function snapshotFromRow(row: { data?: unknown; updated_at?: string } | null): CloudSnapshot | null {
  if (!row?.data || typeof row.updated_at !== 'string') return null;
  const data = parseAppData(row.data);
  if (!data) return null;
  return { data, updatedAt: row.updated_at };
}

export async function waitForSession(): Promise<boolean> {
  const client = supabase;
  if (!client) return false;

  const current = await client.auth.getSession();
  if (current.data.session) return true;

  return new Promise((resolve) => {
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      if (!session) return;
      listener.subscription.unsubscribe();
      resolve(true);
    });
    setTimeout(() => {
      listener.subscription.unsubscribe();
      void client.auth.getSession().then(({ data }) => {
        resolve(Boolean(data.session));
      });
    }, 2500);
  });
}

export async function fetchCloudSnapshot(userId: string): Promise<CloudSnapshot | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('list_states')
    .select('data, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return snapshotFromRow(data);
}

export function countTodos(data: AppData): number {
  const today = data.todayTodos.length;
  const leftover = data.leftoverDays.reduce((sum, day) => sum + day.todos.length, 0);
  const tabs = data.tabs.reduce(
    (sum, tab) =>
      sum + tab.sections.reduce((inner, section) => inner + section.todos.length, 0),
    0,
  );
  return today + leftover + tabs;
}

export async function seedCloudData(userId: string, appData: AppData): Promise<CloudSnapshot | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('list_states')
    .insert({
      user_id: userId,
      data: appData,
      updated_at: new Date().toISOString(),
    })
    .select('data, updated_at')
    .single();

  if (!error) return snapshotFromRow(data);

  const duplicate =
    error.code === '23505' ||
    error.code === '409' ||
    /duplicate|already exists|unique/i.test(error.message);
  if (!duplicate) throw error;

  return fetchCloudSnapshot(userId);
}

export async function pushCloudData(
  userId: string,
  appData: AppData,
  options?: { force?: boolean },
): Promise<{ updatedAt: string | null; replacedWith?: CloudSnapshot }> {
  if (!supabase) return { updatedAt: null };

  if (!options?.force) {
    const remote = await fetchCloudSnapshot(userId);
    if (remote && countTodos(appData) < countTodos(remote.data)) {
      return { updatedAt: remote.updatedAt, replacedWith: remote };
    }
  }

  const { data, error } = await supabase
    .from('list_states')
    .upsert(
      {
        user_id: userId,
        data: appData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select('updated_at')
    .single();

  if (error) throw error;
  return { updatedAt: data?.updated_at ?? null };
}

export function subscribeListStates(
  userId: string,
  onSnapshot: (snapshot: CloudSnapshot) => void,
): () => void {
  const client = supabase;
  if (!client) return () => undefined;

  const channel = client
    .channel(`list_states:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'list_states',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const snap = snapshotFromRow(
          payload.new as { data?: unknown; updated_at?: string },
        );
        if (snap) onSnapshot(snap);
      },
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}

export function isRemoteNewer(remoteAt: string, localAt: string | null): boolean {
  if (!localAt) return true;
  return Date.parse(remoteAt) > Date.parse(localAt) + 250;
}
