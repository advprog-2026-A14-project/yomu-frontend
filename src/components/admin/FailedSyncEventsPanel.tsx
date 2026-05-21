"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, RotateCcw } from "lucide-react";

import {
  getFailedSyncEvents,
  retryFailedSyncEvents,
  type FailedSyncEvent,
} from "@/src/lib/api/admin";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

function formatPayload(payload: string) {
  try {
    return JSON.stringify(JSON.parse(payload), null, 2);
  } catch {
    return payload;
  }
}

export function FailedSyncEventsPanel() {
  const [events, setEvents] = useState<FailedSyncEvent[]>([]);
  const [message, setMessage] = useState("Memuat failed sync events...");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    const response = await getFailedSyncEvents();
    setLoading(false);

    if (!response.success || !("data" in response) || !response.data) {
      setEvents([]);
      setMessage(response.message);
      return;
    }

    setEvents(response.data.events);
    setMessage(response.data.events.length ? "Ada event sync yang perlu ditinjau." : "Tidak ada failed sync event.");
  };

  useEffect(() => {
    void loadEvents();
  }, []);

  const eventIds = useMemo(() => events.map((event) => event.event_id), [events]);

  const retryAll = async () => {
    setBusy(true);
    const response = await retryFailedSyncEvents({ retry_all: true });
    setBusy(false);

    if (!response.success || !("data" in response) || !response.data) {
      setMessage(response.message);
      return;
    }

    setMessage(
      `Retry selesai: ${response.data.processed_count} diproses, ${response.data.done_count} berhasil, ${response.data.failed_count} gagal.`,
    );
    await loadEvents();
  };

  const retrySelected = async () => {
    if (eventIds.length === 0) {
      return;
    }

    setBusy(true);
    const response = await retryFailedSyncEvents({ event_ids: eventIds, retry_all: false });
    setBusy(false);

    if (!response.success || !("data" in response) || !response.data) {
      setMessage(response.message);
      return;
    }

    setMessage(
      `Retry selesai: ${response.data.processed_count} diproses, ${response.data.done_count} berhasil, ${response.data.failed_count} gagal.`,
    );
    await loadEvents();
  };

  return (
    <Card className="border-black/5 bg-white/86">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Outbox Sync Java ke Rust</h2>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{message}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="rounded-full" onClick={loadEvents} disabled={loading}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={retrySelected}
              disabled={busy || eventIds.length === 0}
            >
              <RotateCcw className="size-4" />
              Retry listed
            </Button>
            <Button type="button" className="rounded-full" onClick={retryAll} disabled={busy}>
              Retry all
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          {events.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm text-zinc-500">
              Tidak ada failed sync event yang dikembalikan backend.
            </div>
          ) : null}

          {events.map((event) => (
            <div key={event.event_id} className="rounded-[1.5rem] border border-zinc-200 bg-white p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Event #{event.event_id}</p>
                  <h3 className="mt-1 font-semibold">{event.event_type}</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {event.status}, retry {event.retry_count}
                  </p>
                </div>
                <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                  {event.last_error ?? "No error detail"}
                </div>
              </div>
              <pre className="mt-4 max-h-44 overflow-auto rounded-[1.25rem] bg-zinc-950 p-4 text-xs leading-5 text-zinc-200">
                {formatPayload(event.payload_json)}
              </pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
