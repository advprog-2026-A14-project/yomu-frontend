"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LogOut, RefreshCcw, ShieldAlert } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { getFailedSyncEvents, retryFailedSyncEvents, type FailedSyncEvent } from "@/src/lib/api/admin";
import { logout, me, type User } from "@/src/lib/api/auth";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<FailedSyncEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const loadEvents = async () => {
    const response = await getFailedSyncEvents();

    if (!response.success || !("data" in response) || !response.data) {
      setError(response.message);
      setEvents([]);
      return;
    }

    setError(null);
    setEvents(response.data.events);
  };

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const result = await me();

      if (!active) {
        return;
      }

      if (result.response.success && "data" in result.response && result.response.data) {
        if (result.response.data.role !== "ADMIN") {
          router.replace("/app");
          return;
        }

        setUser(result.response.data);
        await loadEvents();
        if (active) {
          setLoading(false);
        }
        return;
      }

      if (result.status === 401 || result.status === 403) {
        router.replace("/auth/login");
        return;
      }

      setError(result.response.message);
      setLoading(false);
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  const onLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.replace("/auth/login");
  };

  const toggleSelected = (eventId: number) => {
    setSelectedIds((current) =>
      current.includes(eventId) ? current.filter((id) => id !== eventId) : [...current, eventId],
    );
  };

  const retrySelected = async () => {
    setRetrying(true);
    setStatus(null);
    const payload = selectedIds.length > 0 ? { event_ids: selectedIds } : { retry_all: true };
    const response = await retryFailedSyncEvents(payload);
    setRetrying(false);

    if (!response.success || !("data" in response) || !response.data) {
      setError(response.message);
      return;
    }

    setSelectedIds([]);
    setStatus(
      `Processed ${response.data.processed_count}, done ${response.data.done_count}, failed ${response.data.failed_count}.`,
    );
    await loadEvents();
  };

  if (loading) {
    return <main className="min-h-screen bg-zinc-50 p-6 text-sm text-zinc-500">Memuat admin...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] px-5 py-6 text-zinc-950 md:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Admin</p>
              <h1 className="text-3xl font-semibold">{user.display_name}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="rounded-full" onClick={loadEvents}>
              <RefreshCcw className="size-4" />
              Refresh
            </Button>
            <Button type="button" variant="outline" className="rounded-full" onClick={onLogout} disabled={loggingOut}>
              <LogOut className="size-4" />
              {loggingOut ? "Logout..." : "Logout"}
            </Button>
          </div>
        </div>

        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
        {status ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{status}</div> : null}

        <Card className="border-black/5 bg-white">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Failed sync events</p>
                <h2 className="mt-1 text-2xl font-semibold">{events.length} event</h2>
              </div>
              <Button
                type="button"
                className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
                onClick={retrySelected}
                disabled={retrying || events.length === 0}
              >
                <RefreshCcw className="size-4" />
                {retrying ? "Retrying..." : selectedIds.length > 0 ? "Retry selected" : "Retry all"}
              </Button>
            </div>

            {events.length === 0 ? (
              <p className="rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-500">Tidak ada failed atau pending event.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-zinc-100">
                <div className="grid grid-cols-[3rem_5rem_8rem_1fr_7rem] gap-3 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-500">
                  <span />
                  <span>ID</span>
                  <span>Status</span>
                  <span>Error</span>
                  <span>Retry</span>
                </div>
                {events.map((event) => (
                  <button
                    key={event.event_id}
                    type="button"
                    onClick={() => toggleSelected(event.event_id)}
                    className="grid w-full grid-cols-[3rem_5rem_8rem_1fr_7rem] gap-3 border-t border-zinc-100 px-4 py-4 text-left text-sm hover:bg-zinc-50"
                  >
                    <span>
                      <span
                        className={`block size-4 rounded border ${
                          selectedSet.has(event.event_id) ? "border-zinc-950 bg-zinc-950" : "border-zinc-300"
                        }`}
                      />
                    </span>
                    <span>{event.event_id}</span>
                    <span>{event.status}</span>
                    <span className="truncate text-zinc-500">{event.last_error ?? event.event_type}</span>
                    <span>{event.retry_count}</span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
