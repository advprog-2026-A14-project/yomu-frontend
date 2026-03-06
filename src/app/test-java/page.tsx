'use client';
import { useEffect, useState } from 'react';

export default function ConnectivityTest() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    // This calls your Spring Boot Backend
    fetch('http://localhost:8080/api/bacaankuis')
      .then((res) => {
        if (!res.ok) throw new Error('Backend Unreachable');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setStatus('Success! Connected to Java & PostgreSQL.');
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
            {data.map((item: any) => (
              <li key={item.kuisId} className="mt-1">
                {item.kuisTitle} <span className="text-gray-400 text-sm">({item.kuisId})</span>
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