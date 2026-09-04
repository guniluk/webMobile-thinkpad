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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="w-full max-w-lg border shadow-2xl card bg-base-100 border-base-200 animate-scale-up">
        <form onSubmit={handleSubmit} className="p-6 card-body">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-base-200">
            <div className="flex items-center gap-2 text-primary">
              <Edit3 className="w-5 h-5" />
              <h3
                id="edit-modal-title"
                className="text-lg font-bold card-title text-base-content"
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

          <div className="py-2 space-y-4">
            <div>
              <label className="text-sm font-semibold label text-base-content">
                제목
              </label>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                className="w-full text-base input input-bordered focus:input-primary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSaving}
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-semibold label text-base-content">
                내용
              </label>
              <textarea
                placeholder="내용을 입력하세요..."
                className="w-full h-40 text-base resize-none textarea textarea-bordered focus:textarea-primary"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="justify-end gap-2 pt-2 mt-4 border-t card-actions border-base-200">
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
              className="gap-2 btn btn-primary btn-sm md:btn-md"
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
