import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Workout } from "utils/types";
import { client } from "utils/client";
import { getWorkoutRecordQuery } from "utils/quries";
import { Ionicons } from "@expo/vector-icons";
import {
  formatDate,
  formatDuration,
  formatTime,
  getTotalSets,
  getTotalVolume,
} from "utils/utils";

const Workoutrecord = () => {
  const router = useRouter();
  const { workoutId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [workout, setWorkout] = useState<Workout>(null);

  useEffect(() => {
    const fetchWorksOut = async () => {
      try {
        const result = await client.fetch(getWorkoutRecordQuery, {
          workoutId,
        });

        setWorkout(result);
      } catch (error) {
        console.error("Error fetching workout details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorksOut();
  }, [workoutId]);

  const handleDeleteWorkout = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteWorkout,
        },
      ]
    );
  };

  const deleteWorkout = async () => {
    if (!workoutId) return;

    setDeleting(true);
    try {
      await fetch("/api/delete-workout", {
        method: "POST",
        body: JSON.stringify({ workoutId }),
      });
      router.replace("/(app)/(tabs)/history?refresh=true");
    } catch (error) {
      console.error("Error deleting workout:", error);
      Alert.alert("Error", "Failed to delete workout. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
          <Text className="text-gray-600 mt-4 font-kanit">
            Loading workout...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-xl font-semibold text-gray-900 mt-4 font-kanit">
            Workout Not Found
          </Text>
          <Text className="text-gray-600 text-center mt-2 font-kanit">
            This workout record could not be found.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-blue-600 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-medium font-kanit">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { volume, unit } = getTotalVolume(workout);

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ marginBottom: 100 }}
      >
        <View className="bg-white/60 p-6 border-b border-gray-300">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-gray-900 font-kanit">
              Workout Summary
            </Text>

            <TouchableOpacity
              onPress={handleDeleteWorkout}
              disabled={deleting}
              className="bg-red-600 px-4 py-2 rounded-lg flex-row items-center"
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                  <Text className="text-white font-kanit font-medium ml-2">
                    Delete
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 ml-3 font-medium font-kanit">
              {formatDate(workout.date)} at {formatTime(workout.date)}
            </Text>
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 ml-3 font-medium font-kanit">
              {formatDuration(workout.duration)}
            </Text>
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="bar-chart-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 ml-3 font-medium font-kanit">
              {getTotalSets(workout)} total sets
            </Text>
          </View>

          {volume > 0 && (
            <View className="flex-row items-center">
              <Ionicons name="barbell-outline" size={20} color="#6B7280" />
              <Text className="text-gray-700 ml-3 font-medium font-kanit">
                {volume.toLocaleString()} {unit} total volume
              </Text>
            </View>
          )}
        </View>

        <View className="space-y-2 p-5 gap-2">
          {(() => {
            if (!workout.sets) return null;
            const setsMap = new Map();
            workout.sets.forEach((set) => {
              let exKey = "unknown";
              if (set.exercise && typeof set.exercise === "object") {
                if ("_id" in set.exercise && set.exercise._id)
                  exKey = String(set.exercise._id);
                else if ("_ref" in set.exercise && set.exercise._ref)
                  exKey = String(set.exercise._ref);
              }
              if (!setsMap.has(exKey)) {
                setsMap.set(exKey, { exercise: set.exercise, sets: [] });
              }
              setsMap.get(exKey).sets.push(set);
            });
            const groups = Array.from(setsMap.values());
            return groups.map((group, index) => (
              <View
                key={index + (group.exercise?.name || "unknown")}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                {/* 🏋️‍♂️ Exercise Header */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 font-kanit">
                      {group.exercise?.name || "Unknown Exercise"}
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1 font-kanit">
                      {group.sets.length} sets completed
                    </Text>
                  </View>
                  <View className="bg-blue-100 rounded-full w-10 h-10 items-center justify-center">
                    <Text className="text-blue-600 font-bold font-kanit">
                      {index + 1}
                    </Text>
                  </View>
                </View>
                <View className="space-y-2">
                  <Text className="text-sm font-medium text-gray-700 mb-2 font-kanit">
                    Sets:
                  </Text>
                  {group.sets.map((set, setIndex) => (
                    <View
                      key={set._key}
                      className={`bg-gray-50 rounded-lg p-3 flex-row items-center justify-between${
                        setIndex !== group.sets.length - 1 ? " mb-2" : ""
                      }`}
                    >
                      {/* Left side: Set Number and Reps */}
                      <View className="flex-row items-center">
                        <View className="bg-gray-200 rounded-full w-6 h-6 items-center justify-center mr-3">
                          <Text className="text-gray-700 text-xs font-medium font-kanit">
                            {setIndex + 1}
                          </Text>
                        </View>
                        <Text className="text-gray-900 font-medium font-kanit">
                          {set.reps} reps
                        </Text>
                      </View>
                      {/* Right side: Weight info (conditional) */}
                      {set.weight ? (
                        <View className="flex-row items-center">
                          <Ionicons
                            name="barbell-outline"
                            size={16}
                            color="#6B7280"
                          />
                          <Text className="text-gray-700 ml-2 font-medium font-kanit">
                            {set.weight} {set.weightUnit || "lbs"}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
                {/* Exercise Volume */}
                {group.sets && group.sets.length > 0 && (
                  <View className="mt-4 pt-4 border-t border-gray-100">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm text-gray-600 font-kanit">
                        Exercise Volume:
                      </Text>
                      <Text className="text-sm font-medium text-gray-900 font-kanit">
                        {group.sets
                          .reduce((total, set) => {
                            return total + (set.weight || 0) * (set.reps || 0);
                          }, 0)
                          .toLocaleString()}{" "}
                        {group.sets[0]?.weightUnit || "lbs"}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ));
          })()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Workoutrecord;
