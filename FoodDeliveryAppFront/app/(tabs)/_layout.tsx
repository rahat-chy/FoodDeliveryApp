import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { HeaderBackButton } from "@react-navigation/elements";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: theme.text,
          tabBarStyle: {
            backgroundColor: theme.background,
            height: 95,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            paddingBottom: 2,
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
            tabBarIcon: ({ color, size }) => (
              <Feather name="book-open" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
