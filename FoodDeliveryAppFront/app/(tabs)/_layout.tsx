import { ThemeContext } from "@/context/ThemeContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from "@react-navigation/elements";
import { Tabs, useRouter } from "expo-router";
import React, { useContext } from "react";
import { Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

export default function TabLayout() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext must be used inside ThemeProvider");
  }

  const { colorScheme, setColorScheme, theme } = themeContext;
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: theme.text,
          tabBarStyle: {
            backgroundColor: theme.background,
            height: height * 0.07,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarActiveTintColor: theme.tabIconSelected,
          tabBarInactiveTintColor: theme.tabIconDefault,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            headerTitle: "MENU",
            headerStyle: {
              backgroundColor: "rgba(192, 178, 136, 1)",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
            },
            headerLeft: ({ tintColor }) => (
              <HeaderBackButton
                tintColor="white"
                onPress={() => router.back()}
              />
            ),
            tabBarStyle: [
              {
                backgroundColor: theme.background,
                height: height * 0.07,
              },
            ],
            tabBarIcon: ({ color, size }) => (
              <Feather name="book-open" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
