"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import type { ClanDetail } from "@/src/types/clan";

const TIER_COLORS: Record<string, string> = {
  Bronze: "bg-amber-700 text-white",
  Silver: "bg-slate-400 text-white",
  Gold: "bg-yellow-500 text-white",
  Diamond: "bg-cyan-500 text-white",
};

interface ClanDetailCardProps {
  clan: ClanDetail;
}

export default function ClanDetailCard({ clan }: ClanDetailCardProps) {
  return (
    <div className="space-y-6">
      <Card>
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
            <Badge className={TIER_COLORS[clan.tier] ?? "bg-gray-500 text-white"}>
              {clan.tier}
            </Badge>
            <div className="text-right">
              <p className="text-2xl font-bold">{clan.total_score}</p>
              <p className="text-xs text-muted-foreground">Total Skor</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Anggota ({clan.members.length})</CardTitle>
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
              {clan.members.map((member) => (
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

      {clan.active_buffs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Buff Aktif</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {clan.active_buffs.map((buff, i) => (
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

      {clan.active_debuffs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Debuff Aktif</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {clan.active_debuffs.map((debuff, i) => (
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
