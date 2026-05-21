"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, BookOpenText, CheckCircle2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { register } from "@/src/lib/api/auth";

function isPasswordValid(password: string) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password) && !/\s/.test(password);
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !displayName.trim()) {
      setError("Username dan display name wajib diisi.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError("Password minimal 8 karakter, harus ada huruf dan angka, serta tanpa spasi.");
      return;
    }

    if (!email.trim() && !phoneNumber.trim()) {
      setError("Isi minimal salah satu: email atau nomor HP.");
      return;
    }

    setLoading(true);

    const response = await register({
      username: username.trim(),
      display_name: displayName.trim(),
      password,
      email: email.trim() || undefined,
      phone_number: phoneNumber.trim() || undefined,
    });

    setLoading(false);

    if (!response.success) {
      setError(response.message);
      return;
    }

    router.push("/app");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#eef2ff_0%,_#f8fafc_48%,_#fff7ed_100%)] px-5 py-8 text-zinc-950">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <Link href="/" className="inline-flex items-center gap-3 text-sm font-medium text-zinc-700">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-indigo-700 text-white">
              <BookOpenText className="size-4" />
            </span>
            Yomu
          </Link>
          <h1 className="max-w-2xl text-4xl leading-tight font-semibold md:text-5xl">
            Buat akun pelajar dan mulai perjalanan literasi berbasis liga.
          </h1>
          <div className="grid gap-3">
            {["Baca artikel publik", "Kerjakan kuis protected", "Bergabung dengan clan dan leaderboard"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[1.25rem] bg-white/80 px-4 py-3 text-sm text-zinc-700">
                <CheckCircle2 className="size-4 text-emerald-700" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-black/5 bg-white/90 shadow-[0_28px_70px_-46px_rgba(30,64,175,0.42)]">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">Daftar</h2>
              <p className="text-sm leading-6 text-zinc-600">
                Email atau nomor HP wajib salah satu. Nomor HP gunakan format +628...
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display name</Label>
                  <Input id="display_name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                <p className="text-xs leading-5 text-zinc-500">Minimal 8 karakter, ada huruf dan angka, tanpa whitespace.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Nomor HP</Label>
                  <Input id="phone_number" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="+628..." />
                </div>
              </div>

              {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

              <Button type="submit" className="w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800" disabled={loading}>
                {loading ? "Membuat akun..." : "Buat akun"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <p className="mt-6 text-sm text-zinc-600">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="font-medium text-indigo-700 hover:text-indigo-900">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
