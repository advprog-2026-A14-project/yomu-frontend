import { apiFetch } from "./fetcher";

export type FailedSyncEvent = {
  event_id: number;
  event_type: string;
  payload_json: string;
  status: "PENDING" | "FAILED" | "DONE" | string;
  retry_count: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

export type FailedSyncEventsData = {
  events: FailedSyncEvent[];
};

export type RetryFailedSyncData = {
  processed_count: number;
  done_count: number;
  failed_count: number;
};

export async function getFailedSyncEvents() {
  return apiFetch<FailedSyncEventsData>("/api/v1/admin/failed-sync-events", {
    method: "GET",
  });
}

export async function retryFailedSyncEvents(payload: { event_ids?: number[]; retry_all?: boolean }) {
  return apiFetch<RetryFailedSyncData>("/api/v1/admin/failed-sync-events/retry", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
