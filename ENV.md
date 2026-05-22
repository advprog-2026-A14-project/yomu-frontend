# Yomu Frontend Environment

## Build-time vars (baked into Next.js standalone bundle)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_YOMU_API_BASE_URL`
- `NEXT_PUBLIC_RUST_ENGINE_BASE_URL`

## Runtime-only vars
- `CORE_API_BASE_URL`
- `RUST_ENGINE_URL`

## Local dev
- `npm run dev` menjalankan Next.js di `http://localhost:3001` agar tidak bentrok dengan service lokal lain.
- Java API default tetap `http://localhost:8081`.
