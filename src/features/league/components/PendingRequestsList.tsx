"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";
import type { JoinRequest } from "@/src/types/clan";

interface PendingRequestsListProps {
  requests: JoinRequest[];
  onApprove: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export default function PendingRequestsList({
  requests,
  onApprove,
  onReject,
}: PendingRequestsListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  if (requests.length === 0) {
    return null;
  }

  async function handleAction(requestId: string, action: "approve" | "reject") {
    setProcessingId(requestId);
    try {
      if (action === "approve") {
        await onApprove(requestId);
      } else {
        await onReject(requestId);
      }
    } finally {
      setProcessingId(null);
    }
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
              <TableHead className="text-right">Aksi</TableHead>
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
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, "approve")}
                    >
                      {processingId === req.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span className="ml-1 hidden sm:inline">Setuju</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={processingId === req.id}
                      onClick={() => handleAction(req.id, "reject")}
                    >
                      {processingId === req.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span className="ml-1 hidden sm:inline">Tolak</span>
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
