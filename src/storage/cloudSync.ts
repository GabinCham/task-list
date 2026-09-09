import type { AppData } from '../types';
import { supabase } from '../lib/supabase';
import { parseAppData } from './listsStorage';

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
