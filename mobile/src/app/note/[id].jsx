import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  Check,
  X,
} from "lucide-react-native";
import { noteApi } from "../../lib/api";
import { getPaletteForId } from "../../lib/colors";
import DeleteModal from "../../components/DeleteModal";
import RateLimitedUI from "../../components/RateLimitedUI";

export default function NoteDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadNote = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await noteApi.getById(id);
      setNote(data);
      setEditTitle(data.title || "");
      setEditContent(data.content || "");
      setIsRateLimited(false);
    } catch (error) {
      console.error("loadNote error:", error);
      if (error.status === 429 || error.isRateLimited) {
        setIsRateLimited(true);
        setRateLimitMessage(error.message);
      } else {
        Alert.alert("알림", error.message || "노트를 불러오지 못했습니다.", [
          { text: "확인", onPress: () => router.replace("/") },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  // Handle Save
  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      Alert.alert("알림", "제목과 내용을 모두 입력해주세요.");
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
      Alert.alert("성공", "Think가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("handleSave error:", error);
      if (error.status === 429 || error.isRateLimited) {
        setIsRateLimited(true);
        setRateLimitMessage(error.message);
      } else {
        Alert.alert("수정 실패", error.message || "수정에 실패했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  };

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
      setDeleteModalOpen(false);
      Alert.alert("성공", "Think가 삭제되었습니다.", [
        { text: "확인", onPress: () => router.replace("/") },
      ]);
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

  const palette = getPaletteForId(id);

  if (isRateLimited) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <RateLimitedUI onRetry={loadNote} message={rateLimitMessage} />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-slate-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-3 text-xs font-medium text-slate-400">
          Think를 불러오는 중...
        </Text>
      </SafeAreaView>
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
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Navigation & Action Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b shadow-xs border-slate-100">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="flex-row items-center gap-1.5 p-1.5 -ml-1.5"
          >
            <ArrowLeft size={20} color="#334155" />
            <Text className="text-sm font-semibold text-slate-700">목록</Text>
          </TouchableOpacity>

          {!isEditing ? (
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                activeOpacity={0.7}
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-100"
              >
                <Edit3 size={15} color="#4f46e5" />
                <Text className="text-xs font-bold text-indigo-700">수정</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDeleteModalOpen(true)}
                activeOpacity={0.7}
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-100"
              >
                <Trash2 size={15} color="#ef4444" />
                <Text className="text-xs font-bold text-red-600">삭제</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text className="text-base font-bold text-slate-900">
              Think 수정
            </Text>
          )}
        </View>

        <ScrollView
          className="flex-1 px-4 py-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Card */}
          <View className="mb-8 overflow-hidden bg-white border shadow-sm rounded-3xl border-slate-200">
            {/* Top Glowing Color Bar */}
            <View
              style={{ backgroundColor: palette.barColor }}
              className="w-full h-2"
            />

            {isEditing ? (
              /* Edit Mode */
              <View className="p-5">
                <View className="mb-4">
                  <Text className="text-xs font-bold text-slate-700 mb-1.5">
                    제목
                  </Text>
                  <TextInput
                    value={editTitle}
                    onChangeText={setEditTitle}
                    placeholder="제목을 입력하세요"
                    placeholderTextColor="#94a3b8"
                    className="px-4 py-3 text-base font-semibold border bg-slate-50 border-slate-200 rounded-2xl text-slate-900 focus:border-indigo-500 focus:bg-white"
                    editable={!isSaving}
                    autoFocus
                  />
                </View>

                <View className="mb-5">
                  <Text className="text-xs font-bold text-slate-700 mb-1.5">
                    내용
                  </Text>
                  <TextInput
                    value={editContent}
                    onChangeText={setEditContent}
                    placeholder="내용을 작성하세요..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    textAlignVertical="top"
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 min-h-[220px] leading-relaxed focus:border-indigo-500 focus:bg-white"
                    editable={!isSaving}
                  />
                </View>

                {/* Edit Action Buttons */}
                <View className="flex-row gap-2.5 pt-3 border-t border-slate-100">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleCancelEdit}
                    disabled={isSaving}
                    className="flex-1 py-3.5 rounded-2xl bg-slate-100 flex-row items-center justify-center gap-1.5"
                  >
                    <X size={16} color="#475569" />
                    <Text className="text-sm font-bold text-slate-700">
                      취소
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSave}
                    disabled={
                      isSaving || !editTitle.trim() || !editContent.trim()
                    }
                    className={`flex-1 py-3.5 rounded-2xl flex-row items-center justify-center gap-1.5 shadow-md shadow-indigo-200 ${
                      !editTitle.trim() || !editContent.trim()
                        ? "bg-indigo-300"
                        : "bg-indigo-600"
                    }`}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <Check size={16} color="#ffffff" strokeWidth={2.5} />
                        <Text className="text-sm font-bold text-white">
                          저장 완료
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* View Mode */
              <View className="p-5 sm:p-6">
                {/* Meta info & Badge */}
                <View className="flex-row items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <View
                    style={{
                      backgroundColor: palette.badgeBg,
                      borderColor: palette.badgeBorder,
                    }}
                    className="flex-row items-center gap-1 px-3 py-1 border rounded-full"
                  >
                    <Sparkles size={12} color={palette.badgeText} />
                    <Text
                      style={{ color: palette.badgeText }}
                      className="text-xs font-bold"
                    >
                      Think
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1.5">
                    <Calendar size={13} color="#64748b" />
                    <Text className="text-xs font-medium text-slate-500">
                      {formattedCreated}
                    </Text>
                  </View>
                </View>

                {/* Updated timestamp if different */}
                {note.updatedAt !== note.createdAt && (
                  <View className="flex-row items-center gap-1.5 mb-3">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-[11px] text-slate-400">
                      수정됨: {formattedUpdated}
                    </Text>
                  </View>
                )}

                {/* Title */}
                <Text className="mb-4 text-2xl font-black leading-snug tracking-tight text-slate-900">
                  {note.title}
                </Text>

                {/* Content Box */}
                <View className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 min-h-[160px]">
                  <Text className="text-base leading-relaxed text-slate-800">
                    {note.content}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        noteTitle={note?.title}
        isDeleting={isDeleting}
      />
    </SafeAreaView>
  );
}
