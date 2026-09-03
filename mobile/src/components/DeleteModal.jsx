import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { AlertTriangle, Trash2 } from "lucide-react-native";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  noteTitle,
  isDeleting,
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        if (!isDeleting) onClose();
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (!isDeleting) onClose();
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-5">
          <TouchableWithoutFeedback>
            <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
              {/* Header with Icon */}
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 rounded-2xl bg-red-50 items-center justify-center border border-red-100">
                  <AlertTriangle size={24} color="#ef4444" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-slate-900">
                    Think 삭제 확인
                  </Text>
                  <Text className="text-xs text-slate-500">
                    되돌릴 수 없는 작업입니다
                  </Text>
                </View>
              </View>

              {/* Message */}
              <Text className="text-sm text-slate-600 mt-1">
                정말로 이 Think를 삭제하시겠습니까?
              </Text>

              {noteTitle && (
                <View className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-3">
                  <Text
                    numberOfLines={2}
                    className="text-xs font-semibold text-slate-700"
                  >
                    &ldquo;{noteTitle}&rdquo;
                  </Text>
                </View>
              )}

              <Text className="text-[11px] text-red-500 mb-5">
                삭제된 데이터는 서버에서 영구히 삭제됩니다.
              </Text>

              {/* Action Buttons */}
              <View className="flex-row gap-2.5">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onClose}
                  disabled={isDeleting}
                  className="flex-1 py-3.5 rounded-xl bg-slate-100 items-center justify-center"
                >
                  <Text className="text-sm font-bold text-slate-700">취소</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 py-3.5 rounded-xl bg-red-600 flex-row items-center justify-center gap-1.5 shadow-md shadow-red-200"
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Trash2 size={16} color="#ffffff" />
                      <Text className="text-sm font-bold text-white">삭제</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
