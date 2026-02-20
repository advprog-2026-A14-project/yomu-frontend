"use client";

import { useEffect, useState } from "react";

type BacaanKuis = {
  kuisId: string;
  kuisTitle: string;
};

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export default function Home() {
  const [data, setData] = useState<BacaanKuis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKuis = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/bacaankuis`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Request gagal (${response.status})`);
        }

        const result: BacaanKuis[] = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi error");
      } finally {
        setLoading(false);
      }
    };

    fetchKuis();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 p-6 md:p-10">
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Test API Bacaan Kuis</h1>
        <p className="mt-2 text-sm text-zinc-600">Endpoint: {API_URL}/api/bacaankuis</p>

        {loading && <p className="mt-6 text-zinc-700">Loading data...</p>}

        {error && <p className="mt-6 text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <div className="mt-6 space-y-3">
            {data.length === 0 ? (
              <p className="text-zinc-600">Data kosong.</p>
            ) : (
              data.map((item) => (
                <div
                  key={item.kuisId}
                  className="rounded-md border border-zinc-200 p-4"
                >
                  <p className="text-sm text-zinc-500">ID: {item.kuisId}</p>
                  <p className="text-base font-medium text-zinc-900">
                    {item.kuisTitle}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
