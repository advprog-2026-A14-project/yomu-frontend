"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import type { ClanDetail } from "@/src/types/clan";
import { Badge } from "@/src/components/ui/badge";
import { TierBadge } from "@/src/components/yomu/TierBadge";

interface ClanDetailCardProps {
  clan: ClanDetail;
}

export default function ClanDetailCard({ clan }: ClanDetailCardProps) {
  const members = clan.members ?? [];
  const buffs = clan.active_buffs ?? [];
  const debuffs = clan.active_debuffs ?? [];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-black/5 bg-white/88">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{clan.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Dibuat pada {new Date(clan.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TierBadge tier={clan.tier} />
            <div className="text-right">
              <p className="text-2xl font-bold">{clan.total_score}</p>
              <p className="text-xs text-muted-foreground">Total Skor</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-black/5 bg-white/88">
        <CardHeader>
          <CardTitle className="text-lg">Anggota ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Bergabung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.user_id}>
                  <TableCell className="font-mono text-xs">{member.user_id}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === "Leader" ? "default" : "secondary"}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.joined_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {buffs.length > 0 && (
        <Card className="border-black/5 bg-white/88">
          <CardHeader>
            <CardTitle className="text-lg">Buff Aktif</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {buffs.map((buff, i) => (
              <Card key={i} className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CardContent className="p-4">
                  <p className="font-medium">{buff.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Multiplier: {buff.multiplier}x
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(buff.expires_at).toLocaleDateString("id-ID")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {debuffs.length > 0 && (
        <Card className="border-black/5 bg-white/88">
          <CardHeader>
            <CardTitle className="text-lg">Debuff Aktif</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {debuffs.map((debuff, i) => (
              <Card key={i} className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <CardContent className="p-4">
                  <p className="font-medium">{debuff.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Multiplier: {debuff.multiplier}x
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(debuff.expires_at).toLocaleDateString("id-ID")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
