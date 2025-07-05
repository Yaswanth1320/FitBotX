import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Workout } from "utils/types";
import { getWorkoutsQuery } from "utils/quries";
import { client } from "utils/client";
import { formatDuration, formatJoinDate } from "utils/utils";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

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

  useEffect(() => {
    fetchWorksOuts();
  }, [user?.id]);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

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
    <SafeAreaView className="flex flex-1 bg-gray-200">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-6 pt-4 pb-6">
          <Text className="text-3xl font-bold font-kanit text-gray-900">
            Profile
          </Text>
          <Text className="text-lg text-gray-600 mt-1 font-kanit">
            Manage your profile and stats
          </Text>
        </View>

        <View className="px-6 mb-4">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mr-4">
                <Image
                  source={{
                    uri: user.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                  }}
                  className="rounded-full"
                  style={{ width: 64, height: 64 }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-900 font-kanit">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || "User"}
                </Text>
                <Text className="text-gray-600 font-kanit">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </Text>
                <Text className="text-sm text-gray-500 mt-1 font-kanit">
                  Member since {formatJoinDate(joinDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 mb-4">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4 font-kanit">
              Your Fitness Stats
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-600 font-kanit">
                  {totalWorkouts}
                </Text>
                <Text className="text-sm text-gray-600 text-center font-kanit">
                  Total{"\n"}Workouts
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600 font-kanit">
                  {formatDuration(totalDuration)}
                </Text>
                <Text className="text-sm text-gray-600 text-center font-kanit">
                  Total{"\n"}Time
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-purple-600 font-kanit">
                  {daysSinceJoining}
                </Text>
                <Text className="text-sm text-gray-600 text-center font-kanit">
                  Days{"\n"}Active
                </Text>
              </View>
            </View>
            {totalWorkouts > 0 && (
              <View className="mt-4 pt-4 border-t border-gray-100">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600 font-kanit">
                    Average workout duration:
                  </Text>
                  <Text className="font-semibold text-gray-900 font-kanit">
                    {formatDuration(averageDuration)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="px-6 mb-2">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-semibold text-gray-900 mb-4 font-kanit">
              Account Settings
            </Text>
            <View>
              {/* Edit Profile */}
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-4">
                  <Ionicons name="person-outline" size={20} color="#3B82F6" />
                </View>
                <Text className="text-base font-kanit text-gray-900 flex-1">
                  Edit Profile
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#A3A3A3" />
              </TouchableOpacity>
              {/* Notifications */}
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-4">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#22C55E"
                  />
                </View>
                <Text className="text-base font-kanit text-gray-900 flex-1">
                  Notifications
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#A3A3A3" />
              </TouchableOpacity>
              {/* Preferences */}
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-row items-center py-3 border-b border-gray-100"
              >
                <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center mr-4">
                  <Ionicons name="settings-outline" size={20} color="#A855F7" />
                </View>
                <Text className="text-base font-kanit text-gray-900 flex-1">
                  Preferences
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#A3A3A3" />
              </TouchableOpacity>
              {/* Help & Support */}
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-row items-center py-3"
              >
                <View className="w-8 h-8 rounded-full bg-yellow-100 items-center justify-center mr-4">
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#FACC15"
                  />
                </View>
                <Text className="text-base font-kanit text-gray-900 flex-1">
                  Help & Support
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#A3A3A3" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-6 mt-2">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-600 p-4 rounded-2xl shadow-sm"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={18} color="white" />
              <Text className="text-white font-kanit text-xl ml-2">
                Sign out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
