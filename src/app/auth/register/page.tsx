"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { register } from "@/src/lib/api/auth";

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

    if (!username.trim() || !displayName.trim() || !password.trim()) {
      setError("username, display_name, dan password wajib diisi");
      return;
    }

    if (!email.trim() && !phoneNumber.trim()) {
      setError("Minimal salah satu email atau phone_number wajib diisi");
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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold">Register</h1>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label htmlFor="username" className="text-sm">
            Username
          </label>
          <input
            id="username"
            className="w-full rounded border p-2"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="display_name" className="text-sm">
            Display Name
          </label>
          <input
            id="display_name"
            className="w-full rounded border p-2"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
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

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded border p-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="phone_number" className="text-sm">
            Phone Number (optional)
          </label>
          <input
            id="phone_number"
            className="w-full rounded border p-2"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </main>
  );
}
