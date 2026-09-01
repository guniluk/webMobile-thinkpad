import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Check,
  X,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { noteApi } from "../lib/api";
import { getPaletteForId } from "../lib/colors";
import DeleteModal from "../components/DeleteModal";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      noteApi
        .getById(id)
        .then((data) => {
          if (isMounted) {
            setNote(data);
            setEditTitle(data.title || "");
            setEditContent(data.content || "");
            setLoading(false);
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error(error);
            toast.error(error.message || "노트를 불러오는데 실패했습니다.");
            setLoading(false);
            navigate("/");
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  // Handle Save in Edit Mode
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await noteApi.update(id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      setNote(updated);
      setIsEditing(false);
      toast.success("Think가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Cancel Edit Mode
  const handleCancelEdit = () => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
    }
    setIsEditing(false);
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await noteApi.delete(id);
      toast.success("Think가 성공적으로 삭제되었습니다.");
      setDeleteModalOpen(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const palette = getPaletteForId(id);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-base-100 via-base-200/50 to-base-200 py-12 px-4 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="text-sm text-base-content/60">Think를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!note) return null;

  const formattedCreated = new Date(note.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedUpdated = new Date(note.updatedAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-base-100 via-base-200/40 to-base-200/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation & Action Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/"
            className="btn btn-ghost btn-sm sm:btn-md gap-2 rounded-2xl text-base-content/75 hover:text-base-content hover:bg-base-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>목록으로</span>
          </Link>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-outline btn-primary btn-sm sm:btn-md gap-2 rounded-2xl shadow-xs"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4" />
                <span>수정</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-error btn-sm sm:btn-md gap-2 rounded-2xl shadow-xs"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                <span>삭제</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Card Content with themed background */}
        <div
          className={`card ${palette.bgGradient} border border-base-300 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-md`}
        >
          {/* Top Decorative Glow Bar */}
          <div
            className={`h-2 w-full bg-linear-to-r ${palette.glowColor}`}
          />

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSave} className="card-body p-6 sm:p-10 space-y-6">
              <div className="flex items-center gap-2.5 text-primary font-bold text-lg pb-3 border-b border-base-200">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Edit3 className="w-5 h-5" />
                </div>
                <span>Think 수정하기</span>
              </div>

              <div>
                <label className="label font-bold text-base-content text-sm sm:text-base">
                  제목
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="input input-bordered input-primary w-full text-lg font-medium rounded-2xl bg-base-100/80 shadow-xs"
                  required
                  disabled={isSaving}
                  autoFocus
                />
              </div>

              <div>
                <label className="label font-bold text-base-content text-sm sm:text-base">
                  내용
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="내용을 작성하세요..."
                  className="textarea textarea-bordered textarea-primary w-full h-72 text-base leading-relaxed rounded-2xl bg-base-100/80 shadow-xs resize-y"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="card-actions justify-end gap-3 pt-4 border-t border-base-200">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm sm:btn-md gap-1.5 rounded-xl"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                  <span>취소</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm sm:btn-md gap-1.5 rounded-xl shadow-md"
                  disabled={isSaving || !editTitle.trim() || !editContent.trim()}
                >
                  {isSaving ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>완료 (저장)</span>
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="card-body p-6 sm:p-10 space-y-6">
              {/* Header Badges & Dates */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-base-content/60 pb-4 border-b border-base-300/60">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge badge-md ${palette.badgeClass} font-semibold gap-1 py-3 px-3.5`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Think
                  </span>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-base-content/50" />
                    <span>작성: {formattedCreated}</span>
                  </div>
                </div>

                {note.updatedAt !== note.createdAt && (
                  <div className="flex items-center gap-1.5 text-xs text-base-content/50">
                    <Clock className="w-3.5 h-3.5" />
                    <span>수정됨: {formattedUpdated}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-base-content tracking-tight leading-snug wrap-break-word">
                {note.title}
              </h1>

              {/* Content Body */}
              <div className="bg-base-100/70 p-6 sm:p-8 rounded-2xl border border-base-200/80 shadow-xs text-base sm:text-lg text-base-content/90 whitespace-pre-wrap leading-relaxed min-h-52 wrap-break-word">
                {note.content}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        noteTitle={note?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default NoteDetailPage;
