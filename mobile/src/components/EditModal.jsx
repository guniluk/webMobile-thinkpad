import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Edit3, Check, X } from "lucide-react-native";

export default function EditModal({ isOpen, onClose, onSave, note, isSaving }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note, isOpen]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSave(note._id, {
      title: title.trim(),
      content: content.trim(),
    });
  };

  if (!isOpen || !note) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        if (!isSaving) onClose();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/60"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-slate-100 max-h-[85%]">
            {/* Header */}
            <View className="flex-row items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 rounded-lg bg-indigo-50 items-center justify-center">
                  <Edit3 size={18} color="#4f46e5" />
                </View>
                <Text className="text-lg font-bold text-slate-900">
                  Think 수정
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                disabled={isSaving}
                className="p-1 rounded-full bg-slate-100"
              >
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title input */}
              <View className="mb-3.5">
                <Text className="text-xs font-bold text-slate-700 mb-1.5">
                  제목
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="제목을 입력하세요"
                  placeholderTextColor="#94a3b8"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:border-indigo-500 focus:bg-white"
                  editable={!isSaving}
                />
              </View>

              {/* Content input */}
              <View className="mb-5">
                <Text className="text-xs font-bold text-slate-700 mb-1.5">
                  내용
                </Text>
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="내용을 입력하세요..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  textAlignVertical="top"
                  numberOfLines={5}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 min-h-[120px] focus:border-indigo-500 focus:bg-white"
                  editable={!isSaving}
                />
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-2.5 pt-2 border-t border-slate-100 mb-4">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onClose}
                  disabled={isSaving}
                  className="flex-1 py-3.5 rounded-xl bg-slate-100 items-center justify-center"
                >
                  <Text className="text-sm font-bold text-slate-700">취소</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                  disabled={isSaving || !title.trim() || !content.trim()}
                  className={`flex-1 py-3.5 rounded-xl flex-row items-center justify-center gap-1.5 shadow-md shadow-indigo-200 ${
                    !title.trim() || !content.trim()
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
                        저장하기
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
