"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Users, ArrowRight } from "lucide-react";
import type { UserTierInfo } from "@/src/types/clan";

const TIER_COLORS: Record<string, string> = {
  Bronze: "bg-amber-700 text-white",
  Silver: "bg-slate-400 text-white",
  Gold: "bg-yellow-500 text-white",
  Diamond: "bg-cyan-500 text-white",
};

interface ClanHomeCardProps {
  clanInfo: UserTierInfo;
}

export default function ClanHomeCard({ clanInfo }: ClanHomeCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5" />
            Klan Anda
          </CardTitle>
          {clanInfo.tier && (
            <Badge className={TIER_COLORS[clanInfo.tier] ?? "bg-gray-500 text-white"}>
              {clanInfo.tier}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-lg font-semibold">{clanInfo.clan_name ?? "Klan Tanpa Nama"}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          ID: {clanInfo.clan_id}
        </p>
        <Link href={`/clans/${clanInfo.clan_id}`}>
          <Button variant="outline" className="mt-4 w-full">
            Lihat Detail Klan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
