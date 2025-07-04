import * as React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Alert } from "react-native";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    if (!code) {
      Alert.alert("Error", "Please enter your OTP");
      return;
    }
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-white px-6 justify-center">
        <View className="items-center mb-10">
          <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center shadow-sm mb-5">
            <Feather name="mail" size={26} color="black" />
          </View>
          <Text className="text-2xl font-bold text-black font-kanit">
            Check Your Email
          </Text>
          <Text className="text-gray-500 text-center mt-1 font-kanit">
            We’ve sent a verification code to{"\n"}
            <Text className="font-medium text-gray-700">{emailAddress}</Text>
          </Text>
        </View>

        <View className="bg-white/30 p-6 rounded-2xl shadow-2xl backdrop-blur-md space-y-6 flex gap-4">
          <Text className="text-xl font-semibold text-black font-kanit">
            Enter Verification Code
          </Text>

          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-4 bg-gray-50">
            <Feather name="key" size={20} color="#6b7280" />
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              className="ml-3 flex-1 text-xl text-black font-kanit"
            />
          </View>

          <TouchableOpacity
            onPress={onVerifyPress}
            className={`rounded-xl py-4 items-center mt-2 ${
              loading ? `bg-green-300` : `bg-green-600`
            }`}
          >
            <View className="flex-row items-center space-x-2">
              <Text className="text-white text-xl font-semibold font-kanit">
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text>Verify</Text>
                )}
              </Text>
            </View>
          </TouchableOpacity>
          <View className="items-center mt-1">
            <Text className=" text-gray-600 font-kanit text-xl">
              Didn’t receive the code?{" "}
              <Text className="text-blue-600 font-semibold">Resend</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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

        <View className="bg-white/30 p-6 rounded-2xl shadow-2xl backdrop-blur-md space-y-6 flex gap-4">
          <Text className="text-xl font-semibold text-black font-kanit">
            Create an Account
          </Text>

          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-4 bg-gray-50">
            <Feather name="mail" size={20} color="#6b7280" />
            <TextInput
              placeholder="Enter your email"
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              className="ml-3 flex-1 text-black font-kanit text-xl"
            />
          </View>

          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-4 bg-gray-50">
            <Feather name="lock" size={20} color="#6b7280" />
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#9ca3af"
              secureTextEntry
              className="ml-3 flex-1 text-black font-kanit text-xl"
            />
          </View>

          <TouchableOpacity
            onPress={onSignUpPress}
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
        </View>

        <View className="flex-row justify-center mt-10">
          <Text className="text-gray-500 font-kanit text-xl">
            Already have an account?{" "}
          </Text>
          <Link href="/sign-in">
            <Text className="text-blue-600 font-semibold font-kanit text-xl">
              Sign In
            </Text>
          </Link>
        </View>

        <Text className="text-md text-gray-400 text-center mt-4 font-kanit text-md">
          Join FitBotX and get stronger today
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
