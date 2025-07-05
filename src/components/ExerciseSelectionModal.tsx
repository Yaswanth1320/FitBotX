import {
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useWorkoutStore } from "store/workout-store";
import { Ionicons } from "@expo/vector-icons";
import ExcerciseCard from "./ExcerciseCard";

import { Exercise } from "utils/types";
import { client } from "utils/client";
import { exercisesQuery } from "utils/quries";

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const ExerciseSelectionModal = ({
  visible,
  onClose,
}: ExerciseSelectionModalProps) => {
  const router = useRouter();
  const { addExerciseToWorkout } = useWorkoutStore();
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleExercisePress = (exercise: Exercise) => {
    addExerciseToWorkout({ name: exercise.name, sanityId: exercise._id });
    onClose();
  };

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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="bg-white px-4 pt-4 pb-4 shadow-sm border-b border-gray-100">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-2xl font-bold text-gray-800 font-kanit">
              Add Exercise
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-600 mb-3 font-kanit">
            Tap any exercise to add it to your workout
          </Text>

          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-800 font-kanit"
              placeholder="Search exercises..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Exercise list */}
        <FlatList
          data={filteredExercises}
          renderItem={({ item }) => (
            <ExcerciseCard
              item={item}
              onPress={() => handleExercisePress(item)}
              showChevron={false}
            />
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: 32,
            paddingHorizontal: 16,
            gap: 8,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#000000"]} // Android
              tintColor={"#000000"} // iOS
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="fitness-outline" size={64} color="#D1D5DB" />
              <Text className="text-lg font-semibold text-gray-400 mt-4 font-kanit">
                {searchQuery ? "No exercises found" : "Loading exercises..."}
              </Text>
              <Text className="text-sm text-gray-400 mt-2 font-kanit">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Please wait a moment"}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

export default ExerciseSelectionModal;
