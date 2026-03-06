"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { logout, me, type User } from "@/src/lib/api/auth";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

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
        setLoading(false);
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

  if (loading) {
    return <main className="p-6">Memuat data...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-600">{error}</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Hello Admin, {user.display_name}</h1>
      <button
        type="button"
        className="mt-4 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        onClick={onLogout}
        disabled={loggingOut}
      >
        {loggingOut ? "Logout..." : "Logout"}
      </button>
    </main>
  );
}
