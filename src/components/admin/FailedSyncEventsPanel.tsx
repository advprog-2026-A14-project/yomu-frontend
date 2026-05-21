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

function formatPayloadRows(payload: string) {
  try {
    const parsed = JSON.parse(payload) as Record<string, unknown>;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return [["Detail", payload]];
    }

    return Object.entries(parsed)
      .slice(0, 6)
      .map(([key, value]) => [
        key.replaceAll("_", " "),
        typeof value === "object" ? "Data terkait" : String(value),
      ]);
  } catch {
    return [["Detail", payload]];
  }
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    FAILED: "Perlu dipulihkan",
    PENDING: "Menunggu",
    DONE: "Selesai",
  };

  return labels[status] ?? status;
}

function formatEventType(type: string) {
  const labels: Record<string, string> = {
    USER_SYNC: "Data pengguna",
    QUIZ_SYNC: "Hasil kuis",
  };

  return labels[type] ?? "Data Yomu";
}

export function FailedSyncEventsPanel() {
  const [events, setEvents] = useState<FailedSyncEvent[]>([]);
  const [message, setMessage] = useState("Memuat status sinkronisasi...");
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
    setMessage(response.data.events.length ? "Ada item yang perlu ditinjau." : "Semua data sudah tersinkronisasi.");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      `Pemulihan selesai: ${response.data.processed_count} diproses, ${response.data.done_count} berhasil, ${response.data.failed_count} belum berhasil.`,
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
      `Pemulihan selesai: ${response.data.processed_count} diproses, ${response.data.done_count} berhasil, ${response.data.failed_count} belum berhasil.`,
    );
    await loadEvents();
  };

  return (
    <Card className="border-black/5 bg-white/86">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Kesehatan Sinkronisasi</h2>
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
              Pulihkan daftar
            </Button>
            <Button type="button" className="rounded-full" onClick={retryAll} disabled={busy}>
              Pulihkan semua
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          {events.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm text-zinc-500">
              Tidak ada item yang perlu dipulihkan saat ini.
            </div>
          ) : null}

          {events.map((event) => (
            <div key={event.event_id} className="rounded-[1.5rem] border border-zinc-200 bg-white p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Item #{event.event_id}</p>
                  <h3 className="mt-1 font-semibold">{formatEventType(event.event_type)}</h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatStatus(event.status)}, percobaan {event.retry_count}
                  </p>
                </div>
                <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                  {event.last_error ?? "Tidak ada detail tambahan"}
                </div>
              </div>
              <div className="mt-4 grid gap-2 rounded-[1.25rem] bg-zinc-50 p-4">
                {formatPayloadRows(event.payload_json).map(([label, value]) => (
                  <div key={label} className="grid gap-1 text-sm sm:grid-cols-[9rem_1fr]">
                    <span className="capitalize text-zinc-500">{label}</span>
                    <span className="break-words text-zinc-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
