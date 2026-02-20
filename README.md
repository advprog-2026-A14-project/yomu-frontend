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
