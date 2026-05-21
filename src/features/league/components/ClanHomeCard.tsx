"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Users, ArrowRight } from "lucide-react";
import type { UserTierInfo } from "@/src/types/clan";
import { TierBadge } from "@/src/components/yomu/TierBadge";

interface ClanHomeCardProps {
  clanInfo: UserTierInfo;
}

export default function ClanHomeCard({ clanInfo }: ClanHomeCardProps) {
  return (
    <Card className="overflow-hidden border-black/5 bg-white/88 shadow-[0_28px_70px_-42px_rgba(30,64,175,0.28)]">
      <CardHeader className="bg-[linear-gradient(135deg,_#312e81,_#1d4ed8)] text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5" />
            Clan Anda
          </CardTitle>
          <TierBadge tier={clanInfo.tier} className="bg-white/15 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-lg font-semibold">{clanInfo.clan_name ?? "Klan Tanpa Nama"}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          ID: {clanInfo.clan_id}
        </p>
        <Link href={`/clans/${clanInfo.clan_id}`}>
          <Button variant="outline" className="mt-4 w-full rounded-full">
            Lihat detail clan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
