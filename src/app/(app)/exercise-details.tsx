import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Exercise } from "utils/types";
import { client, urlFor } from "utils/client";
import { singleExerciseQuery } from "utils/quries";
import Markdown from "react-native-markdown-display";
import { AiGuide } from "utils/guide";
import { WebView } from "react-native-webview";
import {
  getDifficultyColor,
  getDifficultyText,
} from "@/components/ExcerciseCard";

const ExcerciseDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGuidance, setAiGuidance] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const exerciseData = await client.fetch(singleExerciseQuery, { id });

        setExercise(exerciseData);
      } catch (error) {
        console.error("Error fetching excercise", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [id]);

  const getAiGuidance = async () => {
    if (!exercise) return;
    setAiLoading(true);

    setAiLoading(false);
    setAiLoading(true);
    try {
      const data = await AiGuide(exercise?.name);
      setAiGuidance(data);
      // const response = await fetch("/api/ai", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ exerciseName: exercise?.name }),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to fetch AI guidance");
      // }

      // const data = await response.json();
      // setAiGuidance(data.message);
    } catch (error) {
      console.error("Error fetching Data from Ai", error);
      setAiGuidance(
        "Sorry. There was an error getting Ai guidance. Please try again"
      );
    } finally {
      setAiLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
          <Text className="text-gray-500 font-kanit">Loading exercise..</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View className="absolute top-12 left-0 right-0 z-10 px-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-sm"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="h-80 bg-white relative mt-2">
          {exercise?.image ? (
            <Image
              source={{ uri: urlFor(exercise?.image?.asset?._ref).url() }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
              <Ionicons name="fitness" size={80} color="white" />
            </View>
          )}
        </View>

        <View className="px-6 py-6">
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold font-kanit text-gray-800 mb-2">
                {exercise?.name}
              </Text>
              <View
                className={`self-start px-4 py-2 rounded-full ${getDifficultyColor(
                  exercise?.difficulty
                )}`}
              >
                <Text className="text-sm font-semibold text-white font-kanit">
                  {getDifficultyText(exercise?.difficulty)}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-3 font-kanit">
              Description
            </Text>
            <Text className="text-gray-600 leading-6 text-base font-kanit">
              {exercise?.description || "No description for this exercise"}
            </Text>
          </View>

          {exercise?.videoUrl && (
            <View className="mb-6">
              <Text className="text-3xl font-kanit font-semibold text-gray-800 mt-2 mb-3">
                Video Tutorial
              </Text>
              {exercise.videoUrl.includes("youtube.com") ||
              exercise.videoUrl.includes("youtu.be") ? (
                <View
                  style={{
                    height: 220,
                    overflow: "hidden",
                    marginBottom: 12,
                  }}
                >
                  <WebView
                    source={{
                      uri: `${getYouTubeEmbedUrl(
                        exercise.videoUrl
                      )}?autoplay=0&controls=1`,
                    }}
                    style={{
                      flex: 1,
                      borderRadius: 10,
                    }}
                    allowsFullscreenVideo
                    mediaPlaybackRequiresUserAction={false}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-red-500 rounded-xl flex-row items-center p-4"
                  onPress={() => Linking.openURL(exercise?.videoUrl)}
                >
                  <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
                    <Ionicons name="play" size={20} color="#EF4444" />
                  </View>
                  <View>
                    <Text className="text-white font-semibold text-lg font-kanit">
                      Watch Tutorial
                    </Text>
                    <Text className="text-red-100 text-sm font-kanit">
                      Learn proper form
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}

          {(aiGuidance || aiLoading) && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Ionicons name="fitness" size={34} color="#3B82F6" />
                <Text className="text-xl font-semibold text-gray-800 ml-2 font-kanit">
                  AI Coach says..
                </Text>
              </View>
              {aiLoading ? (
                <View className="bg-gray-50 rounded-xl p-4 items-center">
                  <ActivityIndicator size="small" color="#000000" />
                  <Text className="font-kanit text-gray-600 mt-2">
                    Getting Ai guidance
                  </Text>
                </View>
              ) : (
                <View className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <Markdown
                    style={{
                      body: {
                        paddingBottom: 20,
                        fontFamily: "Kanit",
                      },
                      heading2: {
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#1f2937",
                        marginTop: 12,
                        marginBottom: 6,
                        fontFamily: "Kanit",
                      },
                      heading3: {
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#374151",
                        marginTop: 8,
                        marginBottom: 4,
                        fontFamily: "Kanit",
                      },
                    }}
                  >
                    {aiGuidance}
                  </Markdown>
                </View>
              )}
            </View>
          )}

          <View className="mt-8 gap-2">
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                aiLoading
                  ? "bg-gray-400"
                  : aiGuidance
                  ? "bg-green-600"
                  : "bg-black"
              }`}
              onPress={getAiGuidance}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Loading...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg font-kanit">
                  {aiGuidance
                    ? "Refresh AI Guidance"
                    : "Get Ai Guidance on Form & Technique"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 rounded-xl py-4 items-center"
              onPress={() => router.back()}
            >
              <Text className="text-gray-800 font-bold text-lg font-kanit">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExcerciseDetails;
