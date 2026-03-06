import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-start justify-center px-6">
      <h1 className="text-2xl font-semibold">Yomu Frontend</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Silakan login untuk melanjutkan ke halaman aplikasi.
      </p>
      <Link href="/auth/login" className="mt-4 rounded bg-black px-4 py-2 text-white">
        Ke Login
      </Link>
    </main>
  );
}
