import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <Text>Header</Text>
    </SafeAreaView>
  );
}
