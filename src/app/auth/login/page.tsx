"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import GoogleLoginButton from "@/src/components/GoogleLoginButton";
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

    const response = await login(identifier, password);
    setLoading(false);

    if (!response.success || !("data" in response) || !response.data) {
      setError(response.message);
      return;
    }

    if (response.data.user.role === "ADMIN") {
      router.push("/admin");
      return;
    }

    router.push("/app");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Login</h1>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label htmlFor="identifier" className="text-sm">
            Identifier
          </label>
          <input
            id="identifier"
            className="w-full rounded border p-2"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="username / email / phone"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded border p-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <div className="mt-4">
        <GoogleLoginButton />
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <p className="mt-4 text-sm">
        Belum punya akun?{" "}
        <Link href="/auth/register" className="underline">
          Register
        </Link>
      </p>
    </main>
  );
}
