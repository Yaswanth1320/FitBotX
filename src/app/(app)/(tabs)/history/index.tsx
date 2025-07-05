import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { client } from "utils/client";
import { getWorkoutsQuery } from "utils/quries";
import { Workout } from "utils/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { formatDuration, formatDate } from "utils/utils";
import { Ionicons } from "@expo/vector-icons";

const History = () => {
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

  useEffect(() => {
    fetchWorksOuts();
  }, [user?.id]);

  useEffect(() => {
    if (refresh == "true") {
      fetchWorksOuts();
      router.replace("/(app)/(tabs)/history");
    }
  }, [refresh]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorksOuts();
    setRefreshing(false);
  };

  const formatWorkOutDuration = (seconds?: number) => {
    if (!seconds) return "Duration not avaliable";
    return formatDuration(seconds);
  };

  const getTotalSets = (workout: Workout) => {
    return workout.sets?.length || 0;
  };

  const getUniqueExercisesCount = (workout: Workout) => {
    if (!workout.sets) return 0;
    const unique = new Set(
      workout.sets.map((set) => set.exercise?._ref || set.exercise)
    );
    return unique.size;
  };

  const getExerciseNames = (workout: Workout) => {
    if (!workout.sets) return [];
    const names = workout.sets
      .map((set) =>
        typeof set.exercise === "object" && "name" in set.exercise
          ? set.exercise.name
          : ""
      )
      .filter(Boolean);
    // Return only unique names
    return [...new Set(names)];
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-200">
        <View className="px-6 py-4 bg-white border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            Workout History
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
          <Text className="text-gray-600 mt-4 font-kanit">
            Loading your workouts...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Workout History
        </Text>

        <Text className="mt-1 text-gray-600 font-kanit">
          {workouts.length} workout{workouts.length !== 1 ? "s " : " "}completed
        </Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workouts.length === 0 ? (
          <View className="bg-white rounded-2xl p-8 items-center">
            <Ionicons name="barbell" size={64} color="#00000" />
            <Text className="text-xl font-semibold text-gray-900 mt-4 font-kanit">
              No workouts yet
            </Text>
            <Text className="text-gray-600 text-center mt-2 font-kanit">
              Your finished workouts will display here
            </Text>
          </View>
        ) : (
          <View className="space-y-4 gap-4">
            {workouts?.map((workout) => (
              <TouchableOpacity
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                activeOpacity={0.7}
                key={workout?._id}
                onPress={() => {
                  router.push({
                    pathname: "/history/workout-record",
                    params: {
                      workoutId: workout._id,
                    },
                  });
                }}
              >
                {/* Workout Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 font-kanit">
                      {formatDate(workout.date || "")}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text className="text-gray-600 ml-2 font-kanit">
                        {formatWorkOutDuration(workout.duration)}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center">
                    <Ionicons name="fitness" size={24} color="#3B82F6" />
                  </View>
                </View>
                {/* Workout Stats */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View className="bg-gray-100 rounded-lg px-3 py-2 mr-3">
                      <Text className="text-sm font-medium text-gray-700 font-kanit">
                        {getExerciseNames(workout).length} exercises
                      </Text>
                    </View>
                    <View className="bg-gray-100 rounded-lg px-3 py-2">
                      <Text className="text-sm font-medium text-gray-700 font-kanit">
                        {getTotalSets(workout)} sets
                      </Text>
                    </View>
                  </View>
                </View>
                {/* Exercises List */}
                {getExerciseNames(workout).length > 0 && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2 font-kanit">
                      Exercises:
                    </Text>
                    <View className="flex-row flex-wrap">
                      {getExerciseNames(workout)
                        .slice(0, 3)
                        .map((name: string, index: number) =>
                          name ? (
                            <View
                              key={index}
                              className="bg-blue-50 rounded-lg px-3 py-1 mr-2 mb-2"
                            >
                              <Text className="text-blue-700 text-sm font-medium font-kanit">
                                {name}
                              </Text>
                            </View>
                          ) : null
                        )}
                      {getExerciseNames(workout).length > 3 && (
                        <View className="bg-gray-100 rounded-lg px-3 py-1 mr-2 mb-2">
                          <Text className="text-gray-600 text-sm font-medium font-kanit">
                            +{getExerciseNames(workout).length - 3} more
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
