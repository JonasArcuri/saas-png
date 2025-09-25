import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type EventRow = {
  id: number;
  inserted_at: string;
  type: string;
  metadata: Record<string, unknown> | null;
};

const Analytics = () => {
  const [events, setEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    let mounted = true;
    // Initial fetch
    supabase.from('events').select('*').order('id', { ascending: false }).limit(50).then(({ data }) => {
      if (!mounted || !data) return;
      setEvents(data as EventRow[]);
    });

    // Realtime subscription
    const channel = supabase.channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
        setEvents(prev => [payload.new as EventRow, ...prev].slice(0, 100));
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Realtime Analytics</h1>
          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="text-sm flex items-start justify-between gap-4">
                <div className="font-mono text-muted-foreground min-w-48">{new Date(e.inserted_at).toLocaleString()}</div>
                <div className="font-semibold">{e.type}</div>
                <pre className="text-xs bg-muted/30 p-2 rounded-md overflow-auto max-w-[50ch]">{JSON.stringify(e.metadata ?? {}, null, 2)}</pre>
              </div>
            ))}
            {events.length === 0 && <div className="text-muted-foreground">Sem eventos ainda.</div>}
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;


