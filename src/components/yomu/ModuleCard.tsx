import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

type Props = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  status?: string;
  tone?: string;
};

export function ModuleCard({
  title,
  description,
  href,
  icon: Icon,
  status = "Aktif",
  tone = "bg-indigo-50 text-indigo-700",
}: Props) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full border-black/5 bg-white/88 transition-transform duration-300 hover:-translate-y-1">
        <CardContent className="space-y-5 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className={cn("flex size-11 items-center justify-center rounded-2xl", tone)}>
              <Icon className="size-5" />
            </div>
            <Badge variant={status === "Aktif" ? "default" : "outline"} className={status === "Aktif" ? "bg-emerald-700 text-white" : ""}>
              {status}
            </Badge>
          </div>
          <div>
            <h3 className="text-lg font-semibold leading-tight text-zinc-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900">
            Buka
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
