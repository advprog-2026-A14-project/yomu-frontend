"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { me } from "@/src/lib/api/auth";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const result = await me();

      if (!active) {
        return;
      }

      if (result.response.success && "data" in result.response && result.response.data) {
        router.replace(result.response.data.role === "ADMIN" ? "/admin" : "/app");
        return;
      }

      setChecking(false);
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return <main className="p-6">Memeriksa session...</main>;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-start justify-center px-5 py-8">
      <h1 className="text-2xl font-semibold leading-tight">Yomu Frontend</h1>
      <p className="mt-2 max-w-prose text-sm leading-6 text-zinc-600">
        Silakan login untuk melanjutkan ke halaman aplikasi.
      </p>
      <Link href="/auth/login" className="mt-4 rounded bg-black px-4 py-2 text-white">
        Ke Login
      </Link>
    </main>
  );
}
