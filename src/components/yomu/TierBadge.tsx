import { cn } from "@/src/lib/utils";

type Props = {
  tier?: string | null;
  className?: string;
};

const tierStyles: Record<string, string> = {
  Bronze: "border-[#CD7F32]/30 bg-[#CD7F32]/12 text-[#8A4E18]",
  Silver: "border-[#C0C0C0]/50 bg-[#C0C0C0]/18 text-zinc-700",
  Gold: "border-[#FFD700]/45 bg-[#FFD700]/20 text-amber-800",
  Diamond: "border-[#B9F2FF]/70 bg-[#B9F2FF]/35 text-cyan-800",
};

export function TierBadge({ tier, className }: Props) {
  if (!tier) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-medium",
        tierStyles[tier] ?? "border-zinc-200 bg-zinc-50 text-zinc-700",
        className,
      )}
    >
      {tier}
    </span>
  );
}
