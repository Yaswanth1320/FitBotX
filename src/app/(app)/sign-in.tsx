import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Feather } from "@expo/vector-icons";
import GoogleAuth from "@/components/GoogleAuth";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center"
      >
        <View className="items-center mb-20">
          <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-5">
            <Feather name="activity" size={28} color="black" />
          </View>
          <Text className="text-4xl font-bold text-black font-kanit">
            FitBotX
          </Text>
          <Text className="text-gray-500 text-center mt-1 font-kanit">
            Track your fitness journey{"\n"}and reach your goals
          </Text>
        </View>

        <View className="bg-white/30 p-6 rounded-2xl shadow-2xl backdrop-blur-md space-y-6 flex gap-3">
          <Text className="text-xl font-semibold text-black font-kanit">
            Welcome Back
          </Text>

          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-4 bg-gray-50">
            <Feather name="mail" size={20} color="#6b7280" className="mr-2" />
            <TextInput
              placeholder="Enter your email"
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholderTextColor="#9ca3af"
              className="flex-1 text-black font-kanit text-xl"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-4 bg-gray-50">
            <Feather name="lock" size={20} color="#6b7280" className="mr-2" />
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#9ca3af"
              className="flex-1 text-xl text-black font-kanit"
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            onPress={onSignInPress}
            className={`rounded-xl py-4 items-center mt-2 ${
              loading ? `bg-gray-600` : `bg-black`
            }`}
          >
            <View className="flex-row items-center space-x-2">
              <Text className="text-white text-xl font-semibold font-kanit">
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text>Sign In</Text>
                )}
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center my-3">
            <View className="flex-1 h-px bg-gray-300 font-kanit" />
            <Text className="mx-2 text-gray-400 text-md">or</Text>
            <View className="flex-1 h-px bg-gray-300 font-kanit" />
          </View>

          <GoogleAuth />
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500 font-kanit text-xl">
            Don't have an account?{" "}
          </Text>
          <Link href="/sign-up">
            <Text className="text-blue-600 font-semibold text-xl font-kanit">
              Sign Up
            </Text>
          </Link>
        </View>

        <Text className="text-md text-gray-400 text-center mt-4 font-kanit">
          Start your fitness journey today
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
