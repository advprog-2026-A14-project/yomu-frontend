"use client";

import { useEffect } from "react";

export default function ClansError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-lg text-destructive">Terjadi kesalahan</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {error.message || "Silakan coba lagi"}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        Coba Lagi
      </button>
    </div>
  );
}
