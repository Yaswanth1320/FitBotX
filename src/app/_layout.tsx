import "../global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

export default function Layout() {
  const [loaded] = useFonts({
    Kanit: require("../../assets/fonts/Kanit-Regular.ttf"),
    Michroma: require("../../assets/fonts/Michroma-Regular.ttf"),
    Edu: require("../../assets/fonts/EduNSWACTCursive-VariableFont_wght.ttf"),
  });

  if (!loaded) {
    return null; // or a loading spinner
  }
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  );
}
