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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="w-full max-w-md border shadow-2xl card bg-base-100 border-base-200 animate-scale-up">
        <div className="p-6 card-body">
          <div className="flex items-center gap-3 mb-2 text-error">
            <div className="p-3 rounded-full bg-error/10">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <h3
              id="delete-modal-title"
              className="text-lg font-bold card-title text-base-content"
            >
              Think 삭제 확인
            </h3>
          </div>

          <div className="py-2 text-sm text-base-content/80">
            <p>정말로 이 Think를 삭제하시겠습니까?</p>
            {noteTitle && (
              <span className="block font-semibold text-base-content mt-1.5 truncate bg-base-200 p-2.5 rounded-lg border border-base-300">
                &ldquo;{noteTitle}&rdquo;
              </span>
            )}
            <span className="block mt-2 text-xs text-error/80">
              삭제된 데이터는 영구적으로 제거되며 복구할 수 없습니다.
            </span>
          </div>

          <div className="justify-end gap-2 mt-4 card-actions">
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
              className="gap-2 btn btn-error btn-sm md:btn-md"
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
