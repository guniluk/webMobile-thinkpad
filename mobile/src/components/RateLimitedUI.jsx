import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import {
  ShieldAlert,
  RotateCw,
  Home,
  Clock,
  AlertCircle,
} from "lucide-react-native";

export default function RateLimitedUI({
  onRetry,
  message,
  autoRetrySeconds = 30,
}) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(autoRetrySeconds);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleRetryPress = async () => {
    if (!onRetry || isRetrying) return;
    try {
      setIsRetrying(true);
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const progressPercent = Math.min(
    100,
    Math.max(0, ((autoRetrySeconds - timeLeft) / autoRetrySeconds) * 100)
  );

  return (
    <View className="flex-1 justify-center items-center px-6 py-10 bg-slate-50">
      <View className="w-full max-w-sm bg-white rounded-3xl p-6 border border-amber-200 shadow-xl items-center">
        {/* Animated Badge */}
        <View className="w-20 h-20 rounded-3xl bg-amber-50 items-center justify-center border border-amber-200 mb-4 shadow-inner">
          <ShieldAlert size={40} color="#d97706" />
        </View>

        <View className="flex-row items-center gap-1 bg-amber-100/80 px-3 py-1 rounded-full mb-3">
          <AlertCircle size={14} color="#b45309" />
          <Text className="text-[11px] font-bold text-amber-800 tracking-wider uppercase">
            429 Too Many Requests
          </Text>
        </View>

        <Text className="text-xl font-black text-slate-900 text-center tracking-tight mb-2">
          요청 한도 초과
        </Text>

        <Text className="text-xs text-slate-600 text-center leading-relaxed mb-6">
          {message ||
            "단시간에 너무 많은 요청이 발생하여 서버 보호를 위해 일시적으로 접근이 제한되었습니다."}
        </Text>

        {/* Progress & Countdown */}
        <View className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-1.5">
              <Clock size={14} color="#d97706" />
              <Text className="text-xs font-semibold text-slate-700">
                대기 시간
              </Text>
            </View>
            <Text className="text-xs font-bold text-amber-700">
              {timeLeft > 0 ? `${timeLeft}초 후 권장` : "지금 재시도 가능"}
            </Text>
          </View>

          {/* Progress track */}
          <View className="h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-2.5">
            <View
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-amber-500 rounded-full"
            />
          </View>

          <Text className="text-[11px] text-slate-500 leading-snug">
            💡 Upstash Redis Rate Limiter 정책에 의해 분당 요청수가 제한됩니다.
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full gap-2.5">
          {onRetry && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRetryPress}
              disabled={isRetrying}
              className="w-full py-3.5 rounded-xl bg-amber-500 flex-row items-center justify-center gap-2 shadow-md shadow-amber-200"
            >
              {isRetrying ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <RotateCw size={16} color="#ffffff" />
                  <Text className="text-sm font-bold text-white">
                    다시 시도하기
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.replace("/")}
            className="w-full py-3.5 rounded-xl bg-slate-100 flex-row items-center justify-center gap-2"
          >
            <Home size={16} color="#475569" />
            <Text className="text-sm font-bold text-slate-700">
              홈으로 이동
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
