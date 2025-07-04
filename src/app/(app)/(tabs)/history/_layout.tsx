import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const HistoryLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Kanit",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="workout-record"
        options={{
          headerShown: true,
          headerTitle: "Workout Details",
          headerBackTitle: "Workouts",
          headerBackTitleStyle: {
            fontFamily: "Kanit",
          },
        }}
      />
    </Stack>
  );
};

export default HistoryLayout;
