"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/lib/supabase";
import { MessageCircle, ThumbsUp, Trash2, Send, Loader2 } from "lucide-react";

interface CommentsSectionProps {
  gameId: number;
}

export default function CommentsSection({ gameId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [gameId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?gameId=${gameId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          gameId,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments([newCommentData, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: number) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleUnlike = async (commentId: number) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/comments/${commentId}/like?userId=${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error unliking comment:", error);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "agora mesmo";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} h atrás`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} dias atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  const isLikedByUser = (comment: Comment) => {
    return comment.comment_likes?.some((like) => like.user_id === user?.id);
  };

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6 border border-white/10"
        >
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário..."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-white to-gray-300 text-black font-medium hover:shadow-lg hover:shadow-white/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comentários ({comments.length})
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 glass-strong rounded-2xl border border-white/10">
            <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-strong rounded-xl p-6 border border-white/10"
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-300 overflow-hidden">
                    {comment.users?.avatar_url ? (
                      <img
                        src={comment.users.avatar_url}
                        alt={comment.users.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <span className="text-sm font-bold text-white">
                          {comment.users?.username[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white">
                      {comment.users?.full_name || comment.users?.username}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {getRelativeTime(comment.created_at || "")}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{comment.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        isLikedByUser(comment)
                          ? handleUnlike(comment.id)
                          : handleLike(comment.id)
                      }
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        isLikedByUser(comment) ? "text-white" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLikedByUser(comment) ? "fill-current" : ""}`} />
                      {comment.comment_likes?.length || 0}
                    </button>

                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
