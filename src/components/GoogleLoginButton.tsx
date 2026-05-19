"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { googleLogin } from "@/src/lib/api/auth";

export default function GoogleLoginButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return <p className="text-sm text-red-600">Google client id belum diatur.</p>;
  }

  return (
    <div className="space-y-2">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (loading) {
            return;
          }

          const idToken = credentialResponse.credential;

          if (!idToken) {
            setError("Credential Google tidak tersedia");
            return;
          }

          setLoading(true);
          setError(null);

          const response = await googleLogin(idToken);
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
        }}
        onError={() => {
          setError("Login Google gagal");
        }}
        useOneTap={false}
      />

      {loading ? <p className="text-sm text-zinc-600">Memproses login Google...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
