import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import { ArrowLeft, Sparkles, Plus, PenTool } from "lucide-react-native";
import { noteApi } from "../lib/api";
import RateLimitedUI from "../components/RateLimitedUI";

export default function CreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("알림", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      await noteApi.create({
        title: title.trim(),
        content: content.trim(),
      });
      Alert.alert("성공", "새 Think가 성공적으로 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      console.error("create error:", error);
      if (error.status === 429 || error.isRateLimited) {
        setIsRateLimited(true);
        setRateLimitMessage(error.message);
      } else {
        Alert.alert("생성 실패", error.message || "생성에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRateLimited) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <RateLimitedUI onRetry={handleSubmit} message={rateLimitMessage} />
      </SafeAreaView>
    );
  }

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Navigation Bar */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shadow-xs">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="flex-row items-center gap-1.5 p-1.5 -ml-1.5"
          >
            <ArrowLeft size={20} color="#334155" />
            <Text className="text-sm font-semibold text-slate-700">목록</Text>
          </TouchableOpacity>

          <Text className="text-base font-bold text-slate-900">
            새 Think 작성
          </Text>

          <View className="w-12" />
        </View>

        <ScrollView
          className="flex-1 px-4 py-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card Form */}
          <View className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6">
            {/* Header with Icon & Sparkles */}
            <View className="flex-row items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <View className="w-11 h-11 rounded-2xl bg-indigo-50 items-center justify-center border border-indigo-100">
                <PenTool size={20} color="#4f46e5" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-base font-bold text-slate-900">
                    생각 기록하기
                  </Text>
                  <View className="flex-row items-center gap-0.5 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    <Sparkles size={10} color="#4f46e5" />
                    <Text className="text-[10px] font-bold text-indigo-700">
                      New
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-slate-500 mt-0.5">
                  떠오른 아이디어를 자유롭게 기록하세요
                </Text>
              </View>
            </View>

            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-slate-700 mb-1.5">
                제목
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="제목을 입력하세요"
                placeholderTextColor="#94a3b8"
                className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-base text-slate-900 font-semibold focus:border-indigo-500 focus:bg-white"
                editable={!isSubmitting}
                autoFocus
              />
            </View>

            {/* Content Input */}
            <View className="mb-5">
              <Text className="text-xs font-bold text-slate-700 mb-1.5">
                내용
              </Text>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="어떤 생각을 기록하고 싶으신가요? 내용을 자세히 작성해보세요..."
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 min-h-[220px] leading-relaxed focus:border-indigo-500 focus:bg-white"
                editable={!isSubmitting}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isSubmitting || !isValid}
              className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 shadow-md ${
                isValid && !isSubmitting
                  ? "bg-indigo-600 shadow-indigo-200 active:bg-indigo-700"
                  : "bg-indigo-300"
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Plus size={18} color="#ffffff" strokeWidth={2.5} />
                  <Text className="text-base font-bold text-white">
                    작성 완료
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
