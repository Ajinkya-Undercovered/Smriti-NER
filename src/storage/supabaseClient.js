import { createClient } from '@supabase/supabase-js';

let rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Auto-sanitize accidental double 'h' (e.g. hhttps://)
if (rawUrl.startsWith('hhttps://')) {
  rawUrl = rawUrl.replace('hhttps://', 'https://');
}

function isValidSupabaseUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('your-project-id')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.length > 5;
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(rawUrl) && 
  rawKey && 
  rawKey.length > 20 && 
  !rawKey.includes('your-anon-key')
);

let client = null;
if (isSupabaseConfigured) {
  try {
    client = createClient(rawUrl, rawKey);
  } catch (err) {
    console.warn('Supabase initialization error, using local offline storage:', err);
    client = null;
  }
}

export const supabase = client;
