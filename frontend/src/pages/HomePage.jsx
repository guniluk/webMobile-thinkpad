import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Search,
  RefreshCw,
  Sparkles,
  BookOpen,
  X,
} from "lucide-react";
import { noteApi } from "../lib/api";
import { useDebounce } from "../hooks/useDebounce";
import ThinkCard from "../components/ThinkCard";
import DeleteModal from "../components/DeleteModal";
import EditModal from "../components/EditModal";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 350);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNoteForEdit, setSelectedNoteForEdit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNoteForDelete, setSelectedNoteForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all notes
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await noteApi.getAll();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "노트 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    noteApi
      .getAll()
      .then((data) => {
        if (isMounted) {
          setNotes(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error(error);
          toast.error(error.message || "노트 목록을 불러오지 못했습니다.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Open Edit Modal
  const handleOpenEdit = useCallback((note) => {
    setSelectedNoteForEdit(note);
    setEditModalOpen(true);
  }, []);

  // Save Edit
  const handleSaveEdit = async (id, updatedData) => {
    try {
      setIsSaving(true);
      const updatedNote = await noteApi.update(id, updatedData);
      setNotes((prev) =>
        prev.map((item) => (item._id === id ? updatedNote : item)),
      );
      toast.success("Think가 성공적으로 수정되었습니다.");
      setEditModalOpen(false);
      setSelectedNoteForEdit(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = useCallback((note) => {
    setSelectedNoteForDelete(note);
    setDeleteModalOpen(true);
  }, []);

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!selectedNoteForDelete) return;
    try {
      setIsDeleting(true);
      await noteApi.delete(selectedNoteForDelete._id);
      setNotes((prev) =>
        prev.filter((item) => item._id !== selectedNoteForDelete._id),
      );
      toast.success("Think가 성공적으로 삭제되었습니다.");
      setDeleteModalOpen(false);
      setSelectedNoteForDelete(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Effective query: triggers only when 2 or more chars are entered
  const effectiveQuery = useMemo(() => {
    const trimmed = debouncedSearchQuery.trim();
    return trimmed.length >= 2 ? trimmed.toLowerCase() : "";
  }, [debouncedSearchQuery]);

  // Filter notes by search query
  const filteredNotes = useMemo(() => {
    if (!effectiveQuery) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(effectiveQuery) ||
        note.content.toLowerCase().includes(effectiveQuery),
    );
  }, [notes, effectiveQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-base-100 via-base-200/40 to-base-200/80 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Top Hero & Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content flex items-center gap-2.5">
              <span>내 생각 카드</span>
              <Sparkles className="w-6 h-6 text-warning" />
            </h1>
            <p className="text-sm sm:text-base text-base-content/70 mt-1">
              떠오르는 아이디어와 중요한 생각들을 기록하고 관리하세요.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input with Debounce */}
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Think 검색 (2자 이상)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered input-sm sm:input-md w-full pl-9 pr-8 rounded-xl focus:input-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                  title="검색어 지우기"
                  aria-label="검색어 지우기"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadNotes}
              className="btn btn-ghost btn-circle btn-sm sm:btn-md"
              title="새로고침"
              aria-label="새로고침"
            >
              <RefreshCw
                className={`w-4 h-4 text-base-content/70 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>

            {/* Create Button */}
            <Link
              to="/create"
              className="btn btn-primary btn-sm sm:btn-md gap-1.5 rounded-xl shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">새 Think</span>
            </Link>
          </div>
        </div>

        {/* Notes Count & Filter info */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-base-content/60 mb-4 px-1">
          <div className="flex items-center gap-2">
            <span>
              총{" "}
              <strong className="text-primary">{filteredNotes.length}</strong>
              개의 Think
            </span>
            {effectiveQuery && (
              <span className="badge badge-sm badge-primary badge-outline gap-1">
                &ldquo;{effectiveQuery}&rdquo; 검색 결과
                <button
                  onClick={handleClearSearch}
                  className="hover:text-error ml-0.5"
                  aria-label="검색 초기화"
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery.trim().length === 1 && (
              <span className="text-xs text-warning">
                (2자 이상 입력 시 검색됩니다)
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="card bg-base-100 p-6 border border-base-200 shadow-xs space-y-4 animate-pulse rounded-2xl"
              >
                <div className="h-4 bg-base-300 rounded-md w-1/3" />
                <div className="h-6 bg-base-300 rounded-md w-3/4" />
                <div className="space-y-2">
                  <div className="h-3.5 bg-base-300 rounded-md w-full" />
                  <div className="h-3.5 bg-base-300 rounded-md w-5/6" />
                  <div className="h-3.5 bg-base-300 rounded-md w-2/3" />
                </div>
                <div className="flex justify-between items-center pt-4">
                  <div className="h-8 bg-base-300 rounded-full w-16" />
                  <div className="h-4 bg-base-300 rounded-md w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          /* Empty State */
          <div className="card bg-base-100 border border-base-200 shadow-sm text-center py-16 px-6 rounded-3xl max-w-md mx-auto my-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-base-content mb-2">
              {effectiveQuery
                ? "검색 결과가 없습니다"
                : "작성된 Think가 없습니다"}
            </h3>
            <p className="text-sm text-base-content/60 mb-6">
              {effectiveQuery
                ? `"${effectiveQuery}"에 해당하는 Think를 찾지 못했습니다.`
                : "첫 번째 생각을 기록하고 아이디어를 펼쳐보세요!"}
            </p>
            {effectiveQuery ? (
              <button
                onClick={handleClearSearch}
                className="btn btn-outline btn-sm mx-auto rounded-xl"
              >
                전체 목록 보기
              </button>
            ) : (
              <Link
                to="/create"
                className="btn btn-primary gap-2 mx-auto rounded-xl shadow-md hover:shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />첫 Think 작성하기
              </Link>
            )}
          </div>
        ) : (
          /* Notes Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <ThinkCard
                key={note._id}
                note={note}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedNoteForEdit(null);
        }}
        onSave={handleSaveEdit}
        note={selectedNoteForEdit}
        isSaving={isSaving}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedNoteForDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        noteTitle={selectedNoteForDelete?.title}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default HomePage;
