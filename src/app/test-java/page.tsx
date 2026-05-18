"use client";

import { useEffect, useState } from "react";

type Article = {
  id: string;
  title: string;
  category?: string | null;
};

export default function ConnectivityTest() {
  const [data, setData] = useState<Article[]>([]);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    fetch("/api/v1/articles")
      .then((res) => {
        if (!res.ok) {
          throw new Error("BFF or Java Core unreachable");
        }

        return res.json();
      })
      .then((payload) => {
        if (!payload.success) {
          throw new Error(payload.message ?? "API response failed");
        }

        setData(payload.data ?? []);
        setStatus("Success. Connected through Next BFF to Java Core.");
      })
      .catch((err: Error) => setStatus(`Error: ${err.message}`));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 p-10 font-sans">
      <h1 className="text-2xl font-bold">Integration Test Page</h1>
      <p className={`mt-2 font-semibold ${status.includes("Error") ? "text-red-600" : "text-green-600"}`}>
        Status: {status}
      </p>

      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-medium">Articles from Core API</h2>
        {data.length > 0 ? (
          <ul className="mt-2 list-disc pl-5">
            {data.map((item) => (
              <li key={item.id} className="mt-1">
                {item.title} <span className="text-sm text-gray-400">({item.id})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-500 italic">No data found.</p>
        )}
      </div>
    </main>
  );
}
