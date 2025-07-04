import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(40);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    translateY.value = withTiming(0, { duration: 1000 });

    const timeout = setTimeout(() => {
      router.replace("/sign-in");
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Animated.View style={animatedStyle} className="items-center">
          <Text className="text-black mt-2 text-4xl font-bold tracking-wide font-kanit">
            FitBotX
          </Text>
          <Text className="text-gray-600 text-lg mt-3 italic font-kanit">
            Track. Train. Transform.
          </Text>
          <ActivityIndicator size="small" color="#000000" className="mt-5" />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
