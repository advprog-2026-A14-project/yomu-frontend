"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, BookOpenText, LockKeyhole } from "lucide-react";

import GoogleLoginButton from "@/src/components/GoogleLoginButton";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { login } from "@/src/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await login(identifier.trim(), password);
    setLoading(false);

    if (!response.success || !("data" in response) || !response.data) {
      setError(response.message);
      return;
    }

    router.push(response.data.user.role === "ADMIN" ? "/admin" : "/app");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#eef2ff_0%,_#f8fafc_48%,_#fff7ed_100%)] px-5 py-8 text-zinc-950">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="order-2 border-black/5 bg-white/90 shadow-[0_28px_70px_-46px_rgba(30,64,175,0.42)] lg:order-1">
          <CardContent className="p-6 md:p-8">
            <Link href="/" className="inline-flex items-center gap-3 text-sm font-medium text-zinc-700">
              <span className="flex size-9 items-center justify-center rounded-2xl bg-indigo-700 text-white">
                <BookOpenText className="size-4" />
              </span>
              Yomu
            </Link>

            <div className="mt-8 space-y-2">
              <h1 className="text-3xl font-semibold">Masuk ke Yomu</h1>
              <p className="text-sm leading-6 text-zinc-600">
                Gunakan username, email, atau nomor HP yang sudah terdaftar.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="identifier">Username, email, atau nomor HP</Label>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="contoh: nara / nara@email.com / +628..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

              <Button type="submit" className="w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800" disabled={loading}>
                {loading ? "Memeriksa session..." : "Login"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-4">
              <GoogleLoginButton />
            </div>

            <p className="mt-6 text-sm text-zinc-600">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="font-medium text-indigo-700 hover:text-indigo-900">
                Daftar sebagai pelajar
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="order-1 space-y-5 lg:order-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-indigo-800 shadow-sm">
            <LockKeyhole className="size-4" />
            Satu akun untuk semua pengalaman Yomu
          </div>
          <h2 className="max-w-2xl text-4xl leading-tight font-semibold md:text-5xl">
            Setelah login, kamu bisa lanjut membaca, berdiskusi, mengelola clan, dan melihat papan peringkat.
          </h2>
<<<<<<< HEAD
          <p className="max-w-xl text-base leading-7 text-zinc-600">
            Admin akan diarahkan ke dashboard admin. Pelajar masuk ke dashboard belajar dan kompetisi clan.
          </p>
=======
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
        </div>
      </section>
    </main>
  );
}
