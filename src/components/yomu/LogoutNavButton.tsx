"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { logout } from "@/src/lib/api/auth";

export function LogoutNavButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    router.replace("/auth/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:opacity-60"
      title="Logout"
    >
      <LogOut className="size-4" />
      {loading ? "Keluar..." : "Logout"}
    </button>
  );
}
