import { useEffect } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, noteTitle, isDeleting }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="card bg-base-100 w-full max-w-md shadow-2xl border border-base-200 animate-scale-up">
        <div className="card-body p-6">
          <div className="flex items-center gap-3 text-error mb-2">
            <div className="p-3 bg-error/10 rounded-full">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <h3
              id="delete-modal-title"
              className="card-title text-lg font-bold text-base-content"
            >
              Think 삭제 확인
            </h3>
          </div>

          <div className="text-base-content/80 text-sm py-2">
            <p>정말로 이 Think를 삭제하시겠습니까?</p>
            {noteTitle && (
              <span className="block font-semibold text-base-content mt-1.5 truncate bg-base-200 p-2.5 rounded-lg border border-base-300">
                &ldquo;{noteTitle}&rdquo;
              </span>
            )}
            <span className="block text-xs text-error/80 mt-2">
              삭제된 데이터는 영구적으로 제거되며 복구할 수 없습니다.
            </span>
          </div>

          <div className="card-actions justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-ghost btn-sm md:btn-md"
              onClick={onClose}
              disabled={isDeleting}
            >
              취소
            </button>
            <button
              type="button"
              className="btn btn-error btn-sm md:btn-md gap-2"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
