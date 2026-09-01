import { useState, useEffect } from "react";
import { Edit3, Check, X } from "lucide-react";

const EditModalContent = ({ note, onClose, onSave, isSaving }) => {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isSaving) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSaving, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave(note._id, { title: title.trim(), content: content.trim() });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="card bg-base-100 w-full max-w-lg shadow-2xl border border-base-200 animate-scale-up">
        <form onSubmit={handleSubmit} className="card-body p-6">
          <div className="flex items-center justify-between border-b border-base-200 pb-3 mb-2">
            <div className="flex items-center gap-2 text-primary">
              <Edit3 className="w-5 h-5" />
              <h3
                id="edit-modal-title"
                className="card-title text-lg font-bold text-base-content"
              >
                Think 수정
              </h3>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-circle btn-sm"
              onClick={onClose}
              disabled={isSaving}
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 py-2">
            <div>
              <label className="label text-sm font-semibold text-base-content">
                제목
              </label>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                className="input input-bordered w-full focus:input-primary text-base"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSaving}
                autoFocus
              />
            </div>

            <div>
              <label className="label text-sm font-semibold text-base-content">
                내용
              </label>
              <textarea
                placeholder="내용을 입력하세요..."
                className="textarea textarea-bordered w-full h-40 focus:textarea-primary text-base resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="card-actions justify-end gap-2 mt-4 pt-2 border-t border-base-200">
            <button
              type="button"
              className="btn btn-ghost btn-sm md:btn-md"
              onClick={onClose}
              disabled={isSaving}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm md:btn-md gap-2"
              disabled={isSaving || !title.trim() || !content.trim()}
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              완료 (저장)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditModal = ({ isOpen, onClose, onSave, note, isSaving }) => {
  if (!isOpen || !note) return null;

  return (
    <EditModalContent
      key={note._id}
      note={note}
      onClose={onClose}
      onSave={onSave}
      isSaving={isSaving}
    />
  );
};

export default EditModal;
