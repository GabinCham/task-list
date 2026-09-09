import type { AppData } from '../types';
import { supabase } from '../lib/supabase';
import { parseAppData } from './listsStorage';

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

export async function fetchCloudData(userId: string): Promise<AppData | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('list_states')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data?.data) return null;
  return parseAppData(data.data);
}

export async function pushCloudData(userId: string, appData: AppData): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from('list_states').upsert(
    {
      user_id: userId,
      data: appData,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) throw error;
}
