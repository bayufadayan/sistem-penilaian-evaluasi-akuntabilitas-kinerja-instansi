"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  id_score: number;
  id_users: number | null;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
}

interface CommentSectionProps {
  scoreId: number;
}

export default function CommentSection({ scoreId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments?scoreId=${scoreId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [scoreId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/comments", {
        content: newComment,
        id_score: scoreId,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Gagal menambahkan komentar");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;

    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Gagal menghapus komentar");
    }
  };

  const handleUpdate = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      const response = await axios.patch(`/api/comments/${commentId}`, {
        content: editContent,
      });
      setComments(
        comments.map((c) => (c.id === commentId ? response.data : c))
      );
      setEditingId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Gagal mengupdate komentar");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return diffInMinutes < 1
        ? "Baru saja"
        : `${diffInMinutes} menit yang lalu`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    }
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Diskusi & Komentar
      </h3>

      {/* Form Add Comment */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar atau diskusi..."
            className="textarea textarea-bordered flex-1 min-h-[80px] focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="btn btn-primary self-end"
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10">
                      <span className="text-sm">
                        {comment.user?.name.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {comment.user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                      {comment.updated_at !== comment.created_at && " (diedit)"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {(session?.user?.id === comment.id_users?.toString() ||
                  session?.user?.role === "ADMIN") && (
                  <div className="flex gap-2">
                    {session?.user?.id === comment.id_users?.toString() && (
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="btn btn-ghost btn-xs text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="btn btn-ghost btn-xs text-red-600 hover:text-red-800"
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {editingId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="textarea textarea-bordered w-full min-h-[60px] focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdate(comment.id)}
                      className="btn btn-primary btn-sm"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      className="btn btn-ghost btn-sm"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
