"use client";

import { FormEvent, useState } from "react";
import { createComment } from "@/src/lib/api/forum";

type Props = {
  articleId: string;
  parentCommentId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
  placeholder?: string;
};

export function CommentForm({ articleId, parentCommentId, onSuccess, onCancel, placeholder }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    const response = await createComment(articleId, content.trim(), parentCommentId);
    setLoading(false);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setContent("");
    onSuccess();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <textarea
        className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder ?? "Tulis komentar..."}
        maxLength={5000}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-full bg-zinc-950 px-4 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm text-zinc-600"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}