"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import type { JoinRequest } from "@/src/types/clan";

interface PendingRequestsListProps {
  requests: JoinRequest[];
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function PendingRequestsList({
  requests,
  onApprove,
  onReject,
  isLoading = false,
}: PendingRequestsListProps) {
  const pendingRequests = requests.filter((req) => req.status === "pending");

  if (pendingRequests.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex items-start gap-3 p-5">
          <CheckCircle className="mt-1 size-5 text-green-700" />
          <p className="text-sm leading-6 text-green-950/80">
            Tidak ada permintaan bergabung yang tertunda.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Permintaan Bergabung ({pendingRequests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingRequests.map((req) => (
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
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() => void onApprove(req.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CheckCircle className="size-4" />
                      )}
                      Setuju
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                      onClick={() => void onReject(req.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <XCircle className="size-4" />
                      )}
                      Tolak
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}