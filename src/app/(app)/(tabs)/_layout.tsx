import { Tabs, usePathname } from "expo-router";
import { BlurView } from "expo-blur";
import {
  View,
  Platform,
  Text,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

const TabBarBackground = () => {
  const pathname = usePathname();
  const isExercisesActive = pathname === "/exercises";

  return (
    <BlurView
      intensity={90}
      tint="light"
      style={{
        flex: 1,
        backgroundColor:
          Platform.OS === "android"
            ? "rgba(255,255,255,0.9)"
            : "rgba(255,255,255,0.05)",
        overflow: "hidden",
        borderRadius: 40,
      }}
    >
      {isExercisesActive && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(254, 243, 199, 0.7)", borderRadius: 40 },
          ]}
        />
      )}
    </BlurView>
  );
};

const TabIcon = ({ route, color, size }) => {
  if (route.name === "profile") {
    const { user } = useUser();
    const imageUrl = user?.imageUrl || user?.externalAccounts?.[0]?.imageUrl;
    if (imageUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 22, height: 22, borderRadius: 11, marginRight: 6 }}
        />
      );
    }
    return (
      <MaterialCommunityIcons
        name="face-man-shimmer"
        size={size}
        color={color}
      />
    );
  }
  let iconComponent;
  switch (route.name) {
    case "index":
      iconComponent = (
        <MaterialCommunityIcons name="home-variant" size={size} color={color} />
      );
      break;
    case "exercises":
      iconComponent = (
        <MaterialCommunityIcons name="book" size={size} color={color} />
      );
      break;
    case "workout":
      iconComponent = (
        <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
      );
      break;
    case "history":
      iconComponent = (
        <MaterialCommunityIcons name="history" size={size} color={color} />
      );
      break;
    default:
      iconComponent = (
        <MaterialCommunityIcons name="help-circle" size={size} color={color} />
      );
  }
  return iconComponent;
};

const TabLayout = () => {
  return (
    // Changed the background color here to make the glass effect more visible
    <View style={{ flex: 1, backgroundColor: "#F0F2F5" }}>
      <StatusBar backgroundColor="#1F2937" barStyle="dark-content" />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#111827",
          tabBarInactiveTintColor: "#6B7280",
          tabBarLabelStyle: {
            fontFamily: "Kanit",
            fontSize: 10,
            marginTop: -4,
          },
          tabBarIcon: (props) => <TabIcon {...props} route={route} />,
          tabBarStyle: {
            position: "absolute",
            bottom: 20,
            left: 25,
            right: 25,
            height: 55,
            borderRadius: 50,
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            marginHorizontal: 10,
          },
          tabBarBackground: () => <TabBarBackground />,
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="exercises" options={{ title: "Exercises" }} />
        <Tabs.Screen name="workout" options={{ title: "Workout" }} />
        <Tabs.Screen
          name="active-workout"
          options={{ title: "Active Workout", href: null }}
        />
        <Tabs.Screen name="history" options={{ title: "History" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </View>
  );
};

export default TabLayout;
