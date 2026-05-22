'use client';
import { useEffect, useState } from 'react';

import { API_BASE_URL } from '@/src/lib/api/fetcher';

type LegacyQuizItem = {
  id: string;
  title: string;
};

export default function ConnectivityTest() {
  const [data, setData] = useState<LegacyQuizItem[]>([]);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/articles`, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Backend Unreachable');
        return res.json();
      })
      .then((payload) => {
        if (!payload.success) throw new Error(payload.message);
        setData(payload.data ?? []);
        setStatus('Success! Connected directly to Java backend.');
      })
      .catch((err) => setStatus(`Error: ${err.message}`));
  }, []);

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold">Integration Test Page</h1>
      <p className={`mt-2 font-semibold ${status.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
        Status: {status}
      </p>
      
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-medium">Data from Database:</h2>
        {data.length > 0 ? (
          <ul className="mt-2 list-disc pl-5">
            {data.map((item) => (
              <li key={item.id} className="mt-1">
                {item.title} <span className="text-gray-400 text-sm">({item.id})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-500 italic">No data found. Add rows in psql to see them here.</p>
        )}
      </div>
      <footer className="mt-10 text-xs text-gray-400">mantap</footer>
    </div>
  );
}
