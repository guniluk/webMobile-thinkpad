import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Calendar,
  Sparkles,
  Edit3,
  Trash2,
  ChevronRight,
} from "lucide-react-native";
import { getPaletteForId } from "../lib/colors";

export default function ThinkCard({ note, onEdit, onDelete }) {
  const router = useRouter();
  const palette = getPaletteForId(note._id);

  const targetDate = note.updatedAt || note.createdAt;
  const formattedDate = targetDate
    ? new Date(targetDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const handleCardPress = () => {
    router.push(`/note/${note._id}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handleCardPress}
      className="mb-4 overflow-hidden bg-white border shadow-sm rounded-2xl border-slate-200/80"
    >
      {/* Top Accent Color Bar */}
      <View
        style={{ backgroundColor: palette.barColor }}
        className="h-1.5 w-full"
      />

      <View className="p-4 sm:p-5">
        {/* Top Badges & Date */}
        <View className="flex-row items-center justify-between mb-2.5">
          <View className="flex-row items-center gap-1.5">
            <Calendar size={13} color="#64748b" />
            <Text className="text-xs font-medium text-slate-500">
              {formattedDate}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: palette.badgeBg,
              borderColor: palette.badgeBorder,
            }}
            className="flex-row items-center gap-1 px-2.5 py-0.5 rounded-full border"
          >
            <Sparkles size={11} color={palette.badgeText} />
            <Text
              style={{ color: palette.badgeText }}
              className="text-[11px] font-bold"
            >
              Think
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          numberOfLines={1}
          className="text-lg font-bold text-blue-800 tracking-tight mb-1.5"
        >
          {note.title}
        </Text>

        {/* Content snippet */}
        <Text
          numberOfLines={3}
          className="mb-4 text-sm leading-relaxed text-slate-600"
        >
          {note.content}
        </Text>

        {/* Footer actions */}
        <View className="flex-row items-center justify-between pt-3 border-t border-slate-100">
          <View className="flex-row items-center gap-1">
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={(e) => {
                e.stopPropagation?.();
                onEdit(note);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-2 mr-1 border rounded-xl bg-slate-50 border-slate-100"
            >
              <Edit3 size={15} color="#475569" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={(e) => {
                e.stopPropagation?.();
                onDelete(note);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-2 border border-red-100 rounded-xl bg-red-50"
            >
              <Trash2 size={15} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-0.5">
            <Text
              style={{ color: palette.accentColor }}
              className="text-xs font-bold"
            >
              자세히 보기
            </Text>
            <ChevronRight size={14} color={palette.accentColor} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
