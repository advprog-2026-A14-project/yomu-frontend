"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { createClan } from "@/src/lib/api/clan";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Nama klan minimal 3 karakter")
    .max(50, "Nama klan maksimal 50 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateClanFormProps {
  userId: string;
  onSuccess?: () => void;
}

export default function CreateClanForm({ userId, onSuccess }: CreateClanFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const res = await createClan({
        name: values.name,
        leader_id: userId,
      });
      if (res.success) {
        toast.success("Clan berhasil dibuat!");
        form.reset();
        onSuccess?.();
      } else {
        toast.error(res.message || "Gagal membuat clan");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-black/5 bg-white/88 shadow-[0_28px_70px_-46px_rgba(30,64,175,0.24)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-5 w-5" />
          Buat Clan Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Clan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama clan..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat Clan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
