# Yomu Frontend

A Next.js 16 application with shadcn/ui for the Yomu project.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── (auth)/            # Auth routes (no sidebar)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Dashboard routes (with sidebar)
│   │   ├── clans/
│   │   ├── leaderboard/
│   │   ├── missions/
│   │   └── achievements/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/            # Layout components (Sidebar, Navbar)
│   └── ui/                # shadcn/ui components
├── features/
│   ├── auth/              # Auth features
│   ├── league/            # League features
│   └── gamification/      # Gamification features
├── lib/                   # Utilities
└── types/                 # TypeScript definitions
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Adding shadcn Components

```bash
npx shadcn@latest add [component-name]
```

## Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

# FE Auth Simple
## Flow
- Login local: browser memanggil `POST /api/v1/auth/login` (BFF Next), BFF proxy ke Core, lalu set cookie httpOnly jika sukses.
- Register local: browser memanggil `POST /api/v1/auth/register`, BFF proxy ke Core, lalu set cookie httpOnly jika sukses.
- Login Google SSO: browser memakai `@react-oauth/google`, kirim `id_token` ke `POST /api/v1/auth/google`, BFF set cookie httpOnly jika sukses.

## Session dan Cookie
- Token access tidak disimpan di `localStorage` atau `sessionStorage`.
- Token disimpan di cookie httpOnly oleh route handler Next:
  - nama cookie: `AUTH_COOKIE_NAME` (default `yomu_access_token`)
  - option: `httpOnly`, `sameSite=lax`, `path=/`, `secure` dari `AUTH_COOKIE_SECURE`

## Proteksi Halaman Sederhana
- Halaman `/app` dan `/admin` memanggil `GET /api/v1/users/me` saat mount.
- Jika status `401/403`, user di-redirect ke `/auth/login`.
- Halaman `/admin` mengecek role user:
  - role bukan `ADMIN` diarahkan ke `/app`
- Redirect awal setelah login:
  - `ADMIN` => `/admin`
  - `PELAJAR` => `/app`

## Catatan Penting Saat Pull `main` (Untuk Tambah Modul/Fitur Baru)
- Jangan fetch ke Core langsung dari browser. Selalu lewat endpoint Next BFF: `/api/v1/...`.
- Jangan simpan token di `localStorage`/`sessionStorage`. Token hanya di cookie httpOnly yang di-set Route Handler.
- Jangan decode/verify JWT di frontend. Status login dan role selalu sumbernya dari `GET /api/v1/users/me`.
- Semua endpoint baru wajib pakai wrapper JSON:
  - sukses + data: `{"success": true, "message": "...", "data": ...}`
  - sukses tanpa data: `{"success": true, "message": "..."}`
  - error: `{"success": false, "message": "..."}`
- Semua key JSON wajib `snake_case`.
- Saat bikin Route Handler BFF baru:
  - gunakan `coreFetch(...)` dari `src/lib/server/coreProxy.ts`
  - teruskan status code upstream (contoh `200/400/401/403/409`)
  - jika response upstream tidak valid wrapper, return `502` dengan message `Upstream response invalid`
- Saat bikin halaman protected baru:
  - panggil `me()` di client saat mount
  - jika `401/403` redirect ke `/auth/login`
  - jika butuh role tertentu, validasi `resp.data.role` lalu redirect sesuai kebutuhan
- Untuk Google SSO:
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` di frontend harus sama dengan client id verifier di backend
  - pastikan OAuth origin `http://localhost:3000` terdaftar di Google Cloud
- Format `.env.local` wajib bersih tanpa spasi di nilai dan tanpa komentar inline, contoh:
  - `AUTH_COOKIE_SECURE=false`
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com`
- Minimal verifikasi sebelum push:
  - `npm run lint`
  - `npm run build`
