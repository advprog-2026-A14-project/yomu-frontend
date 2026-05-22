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

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run dev:3000` - Start development server on port 3000
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
- Login local: browser memanggil `POST /api/v1/auth/login` ke route Next.js, lalu route meneruskan request ke Java backend.
- Register local: browser memanggil `POST /api/v1/auth/register` ke route Next.js, lalu route meneruskan request ke Java backend.
- Login Google SSO: browser memakai `@react-oauth/google`, lalu kirim `id_token` ke route Next.js untuk diteruskan ke Java backend.

## Session
- Token access disimpan di cookie httpOnly oleh route Next.js dan tetap disalin ke `localStorage` dengan key `yomu_access_token` untuk kompatibilitas call client-side.
- Data user terakhir disimpan di `localStorage` dengan key `yomu_user`.
- Request private ke Java backend diteruskan oleh route Next.js dengan `Authorization: Bearer <token>`.

## Proteksi Halaman Sederhana
- Halaman `/app` dan `/admin` memanggil `GET /api/v1/users/me` saat mount.
- Jika status `401/403`, user di-redirect ke `/auth/login`.
- Halaman `/admin` mengecek role user:
  - role bukan `ADMIN` diarahkan ke `/app`
- Redirect awal setelah login:
  - `ADMIN` => `/admin`
  - `PELAJAR` => `/app`

## Catatan Penting Saat Pull `main` (Untuk Tambah Modul/Fitur Baru)
- Gunakan helper `src/lib/api/fetcher.ts`; browser memakai route same-origin `/api/v1/**`, sedangkan route Next.js meneruskan ke Java backend.
- Pastikan backend mengaktifkan CORS untuk origin frontend saat development beda port/origin.
- Jangan decode/verify JWT di frontend. Status login dan role selalu sumbernya dari `GET /api/v1/users/me`.
- Semua endpoint baru wajib pakai wrapper JSON:
  - sukses + data: `{"success": true, "message": "...", "data": ...}`
  - sukses tanpa data: `{"success": true, "message": "..."}`
  - error: `{"success": false, "message": "..."}`
- Semua key JSON wajib `snake_case`.
- Saat bikin halaman protected baru:
  - panggil `me()` di client saat mount
  - jika `401/403` redirect ke `/auth/login`
  - jika butuh role tertentu, validasi `resp.data.role` lalu redirect sesuai kebutuhan
- Untuk Google SSO:
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` di frontend harus sama dengan client id verifier di backend
  - pastikan OAuth origin `http://localhost:3001` terdaftar di Google Cloud
- Format `.env.local` wajib bersih tanpa spasi di nilai dan tanpa komentar inline, contoh:
  - `NEXT_PUBLIC_YOMU_API_BASE_URL=http://localhost:8081`
  - `NEXT_PUBLIC_RUST_ENGINE_BASE_URL=http://localhost:8080`
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com`
- Minimal verifikasi sebelum push:
  - `npm run lint`
  - `npm run build`

<!-- Auto-deploy test: 2026-05-21T19:26:08+07:00 -->
# Test deploy trigger Thu May 21 19:26:46 WIB 2026
