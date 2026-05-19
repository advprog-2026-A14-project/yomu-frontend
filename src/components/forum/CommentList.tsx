"use client";

import { useCallback, useEffect, useState } from "react";
import { type Comment, getComments, toggleReaction } from "@/src/lib/api/forum";
import { CommentForm } from "./CommentForm";

type Props = {
  articleId: string;
};

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    Diamond: "bg-sky-100 text-sky-700",
    Gold: "bg-amber-100 text-amber-700",
    Silver: "bg-zinc-100 text-zinc-600",
    Bronze: "bg-orange-100 text-orange-700",
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[tier] ?? "bg-zinc-100 text-zinc-600"}`}>
      {tier}
    </span>
  );
}

function CommentItem({
  comment,
  articleId,
  onRefresh,
  depth = 0,
}: {
  comment: Comment;
  articleId: string;
  onRefresh: () => void;
  depth?: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [reacting, setReacting] = useState(false);

  const handleReaction = async () => {
    setReacting(true);
    await toggleReaction(comment.id);
    setReacting(false);
    onRefresh();
  };

  return (
    <div className={`${depth > 0 ? "ml-6 border-l border-zinc-100 pl-4" : ""}`}>
      <div className="rounded-xl border border-zinc-100 bg-white p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="font-medium text-zinc-800">{comment.user_id.slice(0, 8)}...</span>
          {comment.tier && <TierBadge tier={comment.tier} />}
          {comment.clan_name && (
            <span className="text-zinc-400">{comment.clan_name}</span>
          )}
          <span className="ml-auto">{new Date(comment.created_at).toLocaleDateString("id-ID")}</span>
        </div>

        <p className="text-sm leading-6 text-zinc-700">{comment.content}</p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleReaction}
            disabled={reacting}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 disabled:opacity-50"
          >
            <span>👍</span>
            <span>{comment.reaction_count}</span>
          </button>
          {depth === 0 && (
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-zinc-500 hover:text-zinc-800"
            >
              Balas
            </button>
          )}
        </div>

        {showReplyForm && (
          <div className="pt-2">
            <CommentForm
              articleId={articleId}
              parentCommentId={comment.id}
              onSuccess={() => {
                setShowReplyForm(false);
                onRefresh();
              }}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Tulis balasan..."
            />
          </div>
        )}
      </div>

      {(comment.replies?.length ?? 0) > 0 && (
        <div className="mt-2 space-y-2">
          {(comment.replies ?? []).map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              onRefresh={onRefresh}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({ articleId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    const response = await getComments(articleId);
    setLoading(false);

    if (!response.success || !("data" in response) || !response.data) {
      setError(response.message);
      return;
    }

    setComments(response.data);
  }, [articleId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComments();
  }, [fetchComments]);

  if (loading) return <p className="text-sm text-zinc-500">Memuat komentar...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      <CommentForm articleId={articleId} onSuccess={fetchComments} />

      {comments.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-8">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              onRefresh={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
