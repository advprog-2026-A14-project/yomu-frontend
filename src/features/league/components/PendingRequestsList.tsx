import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { ShieldAlert } from "lucide-react";
import type { JoinRequest } from "@/src/types/clan";

interface PendingRequestsListProps {
  requests: JoinRequest[];
}

export default function PendingRequestsList({
  requests,
}: PendingRequestsListProps) {
  if (requests.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 p-5">
          <ShieldAlert className="mt-1 size-5 text-amber-700" />
          <p className="text-sm leading-6 text-amber-950/80">
            Permintaan bergabung dan persetujuan leader sedang disiapkan. Panel ini akan aktif pada pembaruan berikutnya.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Permintaan Bergabung ({requests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-mono text-xs">{req.user_id}</TableCell>
                <TableCell>
                  {new Date(req.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  Aksi persetujuan belum dibuka.
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
