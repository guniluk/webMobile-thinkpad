import { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Search, X, RotateCw, BookOpen, Plus } from "lucide-react-native";
import Header from "../components/Header";
import ThinkCard from "../components/ThinkCard";
import DeleteModal from "../components/DeleteModal";
import EditModal from "../components/EditModal";
import RateLimitedUI from "../components/RateLimitedUI";
import { noteApi } from "../lib/api";
import { useDebounce } from "../hooks/useDebounce";

export default function HomePage() {
  const router = useRouter();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");

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
  const loadNotes = useCallback(async (isPullRefresh = false) => {
    try {
      if (isPullRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await noteApi.getAll();
      setNotes(Array.isArray(data) ? data : []);
      setIsRateLimited(false);
    } catch (error) {
      console.error("loadNotes error:", error);
      if (error.status === 429 || error.isRateLimited) {
        setIsRateLimited(true);
        setRateLimitMessage(error.message);
      } else {
        Alert.alert(
          "알림",
          error.message || "노트 목록을 불러오지 못했습니다.",
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload notes every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadNotes(false);
    }, [loadNotes]),
  );

  // Handle Edit
  const handleOpenEdit = (note) => {
    setSelectedNoteForEdit(note);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      setIsSaving(true);
      const updated = await noteApi.update(id, updatedData);
      setNotes((prev) =>
        prev.map((item) => (item._id === id ? updated : item)),
      );
      setEditModalOpen(false);
      setSelectedNoteForEdit(null);
      Alert.alert("성공", "Think가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("handleSaveEdit error:", error);
      if (error.status === 429 || error.isRateLimited) {
        setIsRateLimited(true);
        setRateLimitMessage(error.message);
        setEditModalOpen(false);
      } else {
        Alert.alert("수정 실패", error.message || "수정에 실패했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleOpenDelete = (note) => {
    setSelectedNoteForDelete(note);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedNoteForDelete) return;
    try {
      setIsDeleting(true);
      await noteApi.delete(selectedNoteForDelete._id);
      setNotes((prev) =>
        prev.filter((item) => item._id !== selectedNoteForDelete._id),
      );
      setDeleteModalOpen(false);
      setSelectedNoteForDelete(null);
      Alert.alert("성공", "Think가 삭제되었습니다.");
    } catch (error) {
      console.error("handleConfirmDelete error:", error);
      if (error.status === 429 || error.isRateLimited) {
        setIsRateLimited(true);
        setRateLimitMessage(error.message);
        setDeleteModalOpen(false);
      } else {
        Alert.alert("삭제 실패", error.message || "삭제에 실패했습니다.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter notes
  const effectiveQuery = useMemo(() => {
    const trimmed = debouncedSearchQuery.trim();
    return trimmed.length >= 2 ? trimmed.toLowerCase() : "";
  }, [debouncedSearchQuery]);

  const filteredNotes = useMemo(() => {
    if (!effectiveQuery) return notes;
    return notes.filter(
      (note) =>
        (note.title && note.title.toLowerCase().includes(effectiveQuery)) ||
        (note.content && note.content.toLowerCase().includes(effectiveQuery)),
    );
  }, [notes, effectiveQuery]);

  if (isRateLimited) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <RateLimitedUI
          onRetry={() => loadNotes(false)}
          message={rateLimitMessage}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header />

      <View className="flex-1 px-4 pt-4">
        {/* Search Bar & Refresh */}
        <View className="flex-row items-center gap-2 mb-3">
          <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 shadow-xs">
            <Search size={16} color="#94a3b8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Think 검색 (2자 이상)..."
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-2 text-sm text-slate-800 font-medium p-0"
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                className="p-1"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={14} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => loadNotes(false)}
            className="w-11 h-11 bg-white border border-slate-200 rounded-2xl items-center justify-center shadow-xs"
          >
            <RotateCw
              size={18}
              color="#475569"
              className={loading ? "animate-spin" : ""}
            />
          </TouchableOpacity>
        </View>

        {/* Count & Query Status */}
        <View className="flex-row items-center justify-between mb-3 px-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-xs text-slate-500 font-semibold">
              총{" "}
              <Text className="text-indigo-600 font-bold">
                {filteredNotes.length}
              </Text>
              개의 Think
            </Text>
            {searchQuery.trim().length === 1 && (
              <Text className="text-[11px] text-amber-600 font-medium">
                (2자 이상 검색)
              </Text>
            )}
          </View>

          {effectiveQuery ? (
            <View className="flex-row items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
              <Text className="text-[11px] text-indigo-700 font-semibold">
                &ldquo;{effectiveQuery}&rdquo; 검색됨
              </Text>
            </View>
          ) : null}
        </View>

        {/* Main List / Loading / Empty */}
        {loading && !refreshing ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text className="text-xs text-slate-400 font-medium mt-3">
              Think 목록을 불러오는 중...
            </Text>
          </View>
        ) : filteredNotes.length === 0 ? (
          <View className="flex-1 justify-center items-center py-16 px-6">
            <View className="w-16 h-16 rounded-3xl bg-indigo-50 items-center justify-center border border-indigo-100 mb-4">
              <BookOpen size={28} color="#4f46e5" />
            </View>

            <Text className="text-base font-bold text-slate-800 mb-1">
              {effectiveQuery
                ? "검색 결과가 없습니다"
                : "작성된 Think가 없습니다"}
            </Text>

            <Text className="text-xs text-slate-500 text-center leading-relaxed mb-6">
              {effectiveQuery
                ? `"${effectiveQuery}"에 해당하는 Think를 찾지 못했습니다.`
                : "첫 번째 생각을 기록하고 아이디어를 펼쳐보세요!"}
            </Text>

            {effectiveQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200"
              >
                <Text className="text-xs font-bold text-slate-700">
                  전체 목록 보기
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/create")}
                className="flex-row items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-200"
              >
                <Plus size={16} color="#ffffff" strokeWidth={2.5} />
                <Text className="text-sm font-bold text-white">
                  첫 Think 작성하기
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ThinkCard
                note={item}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadNotes(true)}
                tintColor="#4f46e5"
                colors={["#4f46e5"]}
              />
            }
          />
        )}
      </View>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/create")}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 items-center justify-center shadow-lg shadow-indigo-300 border-2 border-white active:scale-95"
      >
        <Plus size={26} color="#ffffff" strokeWidth={2.5} />
      </TouchableOpacity>

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
    </SafeAreaView>
  );
}
