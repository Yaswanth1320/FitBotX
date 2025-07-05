import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { client } from "utils/client";
import { getWorkoutsQuery } from "utils/quries";
import { Workout } from "utils/types";
import { formatDuration } from "utils/utils";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { refresh } = useLocalSearchParams();

  const fetchWorksOuts = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const results = await client.fetch(getWorkoutsQuery, {
        userId: user?.id,
      });
      setWorkouts(results);
    } catch (error) {
      console.error("Error fetching workouts", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorksOuts();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchWorksOuts();
  }, [user?.id]);

  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + (workout.duration || 0),
    0
  );
  const averageDuration =
    totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();
  const daysSinceJoining = Math.floor(
    (new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-200">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
          <Text className="text-gray-600 mt-4 font-kanit">
            Loading Profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome */}
        <View className="px-6 pt-6 pb-6">
          <Text className="text-lg text-gray-600 font-kanit">
            Welcome back,
          </Text>
          <Text className="text-3xl font-bold text-gray-900 font-kanit">
            {user?.firstName || "Athlete"}! 💪
          </Text>
        </View>

        {/* Your Stats Heading */}
        <View className="px-6 mb-2">
          <Text className="text-lg font-semibold text-gray-900 font-kanit">
            Your Stats
          </Text>
        </View>
        {/* Your Stats Card */}
        <View className="px-6 mb-8">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-xl font-bold text-blue-600 font-kanit">
                {totalWorkouts}
              </Text>
              <Text className="text-xs text-gray-600 font-kanit text-center">
                Total{"\n"}Workouts
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-xl font-bold text-green-600 font-kanit">
                {Math.floor(totalDuration / 60)}m {totalDuration % 60}s
              </Text>
              <Text className="text-xs text-gray-600 font-kanit text-center">
                Total{"\n"}Time
              </Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-xl font-bold text-purple-600 font-kanit">
                {Math.floor(averageDuration / 60)}m {averageDuration % 60}s
              </Text>
              <Text className="text-xs text-gray-600 font-kanit text-center">
                Average{"\n"}Duration
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4 font-kanit">
            Quick Actions
          </Text>
          {/* Start Workout */}
          <View className="mb-4">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("active-workout")}
              className="bg-blue-600 rounded-2xl flex-row items-center p-6 shadow-sm"
            >
              <View className="w-12 h-12 bg-blue-700 rounded-full items-center justify-center mr-5">
                <Text className="text-white text-3xl font-bold">▶</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold font-kanit">
                  Start Workout
                </Text>
                <Text className="text-blue-100 font-kanit text-lg">
                  Begin your training session
                </Text>
              </View>
              <Text className="text-blue-100 text-3xl font-bold">›</Text>
            </TouchableOpacity>
          </View>
          {/* Two small cards */}
          <View className="flex-row gap-2 space-x-5">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("history")}
              className="flex-1 bg-white rounded-2xl p-5 items-center shadow-sm border border-gray-100"
            >
              <Text className="text-3xl text-gray-500 mb-2">🕒</Text>
              <Text className="font-kanit text-gray-900 font-bold text-lg">
                Workout History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("exercises")}
              className="flex-1 bg-white rounded-2xl p-5 items-center shadow-sm border border-gray-100"
            >
              <Text className="text-3xl text-gray-500 mb-2">🏋️‍♂️</Text>
              <Text className="font-kanit text-gray-900 font-bold text-lg">
                Browse Exercises
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Last Workout */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4 font-kanit">
            Last Workout
          </Text>
          {workouts.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center justify-center">
              <View className="bg-blue-100 rounded-full p-4 mb-4">
                <Text className="text-blue-500 text-3xl">🏋️‍♂️</Text>
              </View>
              <Text className="text-xl font-bold text-gray-900 font-kanit mb-2 text-center">
                Ready to start your fitness journey?
              </Text>
              <Text className="text-gray-500 font-kanit mb-6 text-center">
                Track your workouts and see your progress over time
              </Text>
              <TouchableOpacity
                onPress={() => router.push("active-workout")}
                className="bg-blue-600 rounded-xl px-6 py-3"
                activeOpacity={0.85}
              >
                <Text className="text-white font-kanit font-bold text-base">
                  Start Your First Workout
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity activeOpacity={0.85}>
              <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-base font-kanit text-gray-900 font-semibold">
                    {require("utils/utils").formatDate(workouts[0].date)}
                  </Text>
                  <Text className="text-blue-600 font-kanit font-bold">
                    {require("utils/utils").formatDuration(
                      workouts[0].duration
                    )}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-600 font-kanit text-sm">
                    {workouts[0].sets.length} sets
                  </Text>
                  <Text className="text-gray-600 font-kanit text-sm">
                    {require("utils/utils")
                      .getExerciseNames(workouts[0])
                      .join(", ") || "No exercises"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-500 font-kanit text-xs">
                    Volume:{" "}
                    {require("utils/utils").getTotalVolume(workouts[0]).volume}{" "}
                    {require("utils/utils").getTotalVolume(workouts[0]).unit}
                  </Text>
                  <View className="bg-blue-100 rounded-full p-2">
                    <Text className="text-blue-600 text-xl">💙</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
