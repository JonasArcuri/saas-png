import { supabase } from '@/lib/supabaseClient';

type AnalyticsEvent = {
  type: 'upload_selected' | 'convert_started' | 'convert_success' | 'convert_error' | 'download_zip' | 'download_single';
  metadata?: Record<string, unknown>;
};

function isEnabled(): boolean {
  return (import.meta.env.VITE_ANALYTICS_ENABLED || 'false') === 'true';
}

export async function logEvent(event: AnalyticsEvent) {
  if (!isEnabled()) return;
  try {
    const { error } = await supabase.from('events').insert({
      type: event.type,
      metadata: event.metadata ?? {},
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to log event', error);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to log event', e);
  }
}


