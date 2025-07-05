import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { client } from "utils/client";
import { exercisesQuery } from "utils/quries";
import { useRouter } from "expo-router";
import { Exercise } from "utils/types";
import ExcerciseCard from "@/components/ExcerciseCard";

const exercises = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const filterd = exercises.filter((exercises: Exercise) =>
      exercises.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filterd);
  }, [searchQuery, exercises]);

  const fetchExercises = async () => {
    try {
      const exercises = await client.fetch(exercisesQuery);
      setExercises(exercises);
      setFilteredExercises(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchExercises();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-200">
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold font-kanit text-gray-900">
          Exercises Library
        </Text>
        <Text className="text-gray-600 mt-1 font-kanit">
          Discover exercises with our comprehensive library.
        </Text>
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search exercises"
            className="flex-1 ml-2 text-gray-800 font-kanit"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, gap: 10, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <ExcerciseCard
            item={item}
            onPress={() => router.push(`/exercise-details?id=${item._id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#000000"]}
            tintColor="#000000"
            title="Pull to refresh exercises"
            titleColor="#000000"
            className="font-kanit"
          />
        }
        ListEmptyComponent={
          <View className="bg-white rounded-2xl  p-8 items-center">
            <Ionicons name="fitness-outline" size={64} color="#6b7280" />
            <Text className="text-xl font-semibold text-gray-900 mt-4 font-kanit">
              {searchQuery ? "No exercises found" : "Loading exercises..."}
            </Text>
            <Text className="text-gray-600 mt-2 font-kanit text-center">
              {searchQuery
                ? "Try adjusting your search "
                : "Your exercises will appear here"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default exercises;
