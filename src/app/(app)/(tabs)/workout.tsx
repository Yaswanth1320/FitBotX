import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const workout = () => {
  const router = useRouter();

  const startWorkout = () => {
    router.push("/active-workout");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 px-6">
        <View className="pt-8 pb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2 font-kanit">
            Ready to Train?
          </Text>
          <Text className="text-lg text-gray-600 font-kanit">
            Start your workout session
          </Text>
        </View>
      </View>

      <View className="bg-white/95 rounded-3xl p-6 shadow-sm border border-gray-100 mx-4 mb-16">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="fitness" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-xl font-semibold text-gray-900 font-kanit">
                Start Workout
              </Text>
              <Text className="text-gray-500 font-kanit">
                Begin your training session
              </Text>
            </View>
          </View>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 font-medium text-sm font-kanit">
              Ready
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={startWorkout}
          className="bg-blue-600 rounded-2xl py-4 items-center active:bg-blue-700"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="play"
              size={18}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-lg font-kanit">
              Start Workout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default workout;
