import { apiFetch } from "./fetcher";
import { getAccessToken } from "./auth";

export type FailedSyncEvent = {
  event_id: number;
  event_type: string;
  payload_json: string;
  status: string;
  retry_count: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

export type FailedSyncEventsData = {
  events: FailedSyncEvent[];
};

export type RetryFailedSyncResult = {
  processed_count: number;
  done_count: number;
  failed_count: number;
};

export async function getFailedSyncEvents() {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Session admin tidak ditemukan" };
  }

  return apiFetch<FailedSyncEventsData>("/api/v1/admin/failed-sync-events", {
    method: "GET",
    token,
  });
}

export async function retryFailedSyncEvents(payload: { event_ids?: number[]; retry_all?: boolean }) {
  const token = getAccessToken();

  if (!token) {
    return { success: false as const, message: "Session admin tidak ditemukan" };
  }

  return apiFetch<RetryFailedSyncResult>("/api/v1/admin/failed-sync-events/retry", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}
