import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Lightbulb, Plus } from "lucide-react-native";

export default function Header({ showCreateButton = true }) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100 shadow-xs">
      <TouchableOpacity
        onPress={() => router.push("/")}
        activeOpacity={0.7}
        className="flex-row items-center gap-2.5"
      >
        <View className="w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center border border-indigo-100">
          <Lightbulb size={22} color="#4f46e5" strokeWidth={2.2} />
        </View>
        <View>
          <Text className="text-xl font-black text-slate-900 tracking-tight">
            ThinkPad
          </Text>
          <Text className="text-[10px] font-semibold text-indigo-600 -mt-0.5">
            Mobile Idea Space
          </Text>
        </View>
      </TouchableOpacity>

      {showCreateButton && (
        <TouchableOpacity
          onPress={() => router.push("/create")}
          activeOpacity={0.8}
          className="flex-row items-center gap-1.5 bg-indigo-600 px-3.5 py-2 rounded-xl shadow-md shadow-indigo-200 active:bg-indigo-700"
        >
          <Plus size={16} color="#ffffff" strokeWidth={2.5} />
          <Text className="text-white font-bold text-xs">새 Think</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
