import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { NetworkProvider } from "@/context/NetworkProviderContext";
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
      <NetworkProvider>
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
          <Stack.Screen
            name="createUpdate"
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
      </NetworkProvider>
    </ThemeProvider>
  );
}
