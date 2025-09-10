import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Appearance } from "react-native";

import { Colors } from "@/constants/Colors";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="menuDetails/[id]"
          options={{
            headerStyle: {
              backgroundColor: "rgba(192, 178, 136, 1)",
            },
            headerTintColor: "white",
            headerTitleStyle: {
              color: "white",
            },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
