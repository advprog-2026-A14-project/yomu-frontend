import { apiFetch } from "./fetcher";

export type Comment = {
  id: string;
  article_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  reaction_count: number;
  clan_name: string | null;
  tier: string | null;
  replies: Comment[];
};

export async function getComments(articleId: string) {
  return apiFetch<Comment[]>(`/api/v1/forums/${articleId}/comments`, {
    method: "GET",
  });
}

export async function createComment(articleId: string, content: string, parentCommentId?: string) {
  return apiFetch<Comment>(`/api/v1/forums/${articleId}/comments`, {
    method: "POST",
    body: JSON.stringify({
      content,
      parent_comment_id: parentCommentId ?? null,
    }),
  });
}

export async function toggleReaction(commentId: string) {
  return apiFetch<{
    comment_id: string;
    reaction_type: string;
    reacted: boolean;
    reaction_count: number;
  }>(`/api/v1/forums/comments/${commentId}/reactions`, {
    method: "POST",
    body: JSON.stringify({ reaction_type: "UPVOTE" }),
  });
}