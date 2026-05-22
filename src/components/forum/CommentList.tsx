"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import { me, type User } from "@/src/lib/api/auth";
import {
  type Comment,
  type ReactionType,
  deleteComment,
  getComments,
  toggleReaction,
  updateComment,
} from "@/src/lib/api/forum";
<<<<<<< HEAD
import { Check, MessageCircle, Pencil, ThumbsDown, ThumbsUp, Trash2, X } from "lucide-react";
=======
import { Check, Heart, MessageCircle, Pencil, ThumbsDown, ThumbsUp, Trash2, X } from "lucide-react";
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
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
  currentUser,
  onRefresh,
  depth = 0,
}: {
  comment: Comment;
  articleId: string;
  currentUser: User | null;
  onRefresh: () => void;
  depth?: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [reactingType, setReactingType] = useState<ReactionType | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isOwner = currentUser?.user_id === comment.user_id;
  const isAdmin = currentUser?.role === "ADMIN";
  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;
  const upvoteCount = comment.upvote_count ?? comment.reaction_count;
  const downvoteCount = comment.downvote_count ?? 0;
<<<<<<< HEAD
=======
  const emojiCount = comment.emoji_count ?? 0;
  const authorName = comment.author?.display_name ?? comment.author?.username ?? `${comment.user_id.slice(0, 8)}...`;
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9

  const handleReaction = async (reactionType: ReactionType) => {
    setReactingType(reactionType);
    setActionError(null);

    const response = await toggleReaction(comment.id, reactionType);
    setReactingType(null);

    if (!response.success) {
      setActionError(response.message);
      return;
    }

    onRefresh();
  };

  const startEditing = () => {
    setShowReplyForm(false);
    setActionError(null);
    setDraftContent(comment.content);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraftContent(comment.content);
    setActionError(null);
    setEditing(false);
  };

  const handleSaveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = draftContent.trim();
    if (!content) return;

    if (content === comment.content) {
      setEditing(false);
      return;
    }

    setSaving(true);
    setActionError(null);

    const response = await updateComment(comment.id, content);
    setSaving(false);

    if (!response.success) {
      setActionError(response.message);
      return;
    }

    setEditing(false);
    onRefresh();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Hapus komentar ini?");

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setActionError(null);

    const response = await deleteComment(comment.id);
    setDeleting(false);

    if (!response.success) {
      setActionError(response.message);
      return;
    }

    onRefresh();
  };

  return (
<<<<<<< HEAD
    <div className={`${depth > 0 ? "ml-6 border-l border-zinc-100 pl-4" : ""}`}>
      <div className="space-y-2 rounded-lg border border-zinc-100 bg-white p-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="font-medium text-zinc-800">{comment.user_id.slice(0, 8)}...</span>
          {comment.tier && <TierBadge tier={comment.tier} />}
          {comment.clan_name && <span className="text-zinc-400">{comment.clan_name}</span>}
          <span className="ml-auto">{new Date(comment.created_at).toLocaleDateString("id-ID")}</span>
=======
    <div className={`${depth > 0 ? "ml-3 border-l border-zinc-100 pl-3 sm:ml-6 sm:pl-4" : ""}`}>
      <div className="space-y-3 rounded-xl border border-zinc-100 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
          <span className="font-medium text-zinc-800">{authorName}</span>
          {comment.tier && <TierBadge tier={comment.tier} />}
          {comment.clan_name && <span className="text-zinc-400">{comment.clan_name}</span>}
          <span className="ml-auto whitespace-nowrap">{new Date(comment.created_at).toLocaleDateString("id-ID")}</span>
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
        </div>

        {editing ? (
          <form onSubmit={handleSaveEdit} className="space-y-2">
            <textarea
              className="w-full resize-none rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm leading-6 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:opacity-60"
              rows={3}
              value={draftContent}
              onChange={(event) => setDraftContent(event.target.value)}
              maxLength={5000}
              disabled={saving}
              autoFocus
              required
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={saving || !draftContent.trim()}
                className="inline-flex size-8 items-center justify-center rounded-full bg-zinc-950 text-white disabled:opacity-50"
                aria-label="Simpan perubahan"
              >
                <Check className="size-4" />
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="inline-flex size-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 hover:text-zinc-800 disabled:opacity-50"
                aria-label="Batal edit"
              >
                <X className="size-4" />
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm leading-6 text-zinc-700">{comment.content}</p>
        )}

        {actionError && <p className="text-xs text-red-600">{actionError}</p>}

<<<<<<< HEAD
        <div className="flex items-center gap-3 pt-1">
=======
        <div className="flex flex-wrap items-center gap-2 pt-1">
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
          <button
            type="button"
            onClick={() => handleReaction("UPVOTE")}
            disabled={reactingType !== null}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 text-xs font-medium text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50"
            aria-label="Upvote komentar"
            title="Upvote"
          >
            <ThumbsUp className="size-4" />
            <span className="text-zinc-400">{upvoteCount}</span>
          </button>
          <button
            type="button"
            onClick={() => handleReaction("DOWNVOTE")}
            disabled={reactingType !== null}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 text-xs font-medium text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50"
            aria-label="Downvote komentar"
            title="Downvote"
          >
            <ThumbsDown className="size-4" />
            <span className="text-zinc-400">{downvoteCount}</span>
          </button>
<<<<<<< HEAD
=======
          <button
            type="button"
            onClick={() => handleReaction("EMOJI")}
            disabled={reactingType !== null}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 text-xs font-medium text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50"
            aria-label="Reaksi emoji komentar"
            title="Emoji"
          >
            <Heart className="size-4" />
            <span className="text-zinc-400">{emojiCount}</span>
          </button>
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
          {depth === 0 && !editing && (
            <button
              type="button"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800"
            >
              <MessageCircle className="size-4" />
              Balas
            </button>
          )}
          {(canEdit || canDelete) && !editing && (
            <div className="ml-auto flex items-center gap-1">
              {canEdit && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex size-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-50 hover:text-zinc-800"
                  aria-label="Edit komentar"
                >
                  <Pencil className="size-4" />
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex size-8 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  aria-label="Hapus komentar"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {showReplyForm && !editing && (
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
              currentUser={currentUser}
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setError(null);

    const response = await getComments(articleId);
    setLoading(false);

    if (!response.success || !("data" in response) || !response.data) {
      setError(response.message);
      return;
    }

    setComments(response.data);
  }, [articleId]);

  useEffect(() => {
    let active = true;

    me().then((result) => {
      if (active && result.response.success && result.response.data) {
        setCurrentUser(result.response.data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

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
        <p className="py-8 text-center text-sm text-zinc-500">Belum ada komentar. Jadilah yang pertama!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
              currentUser={currentUser}
              onRefresh={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
