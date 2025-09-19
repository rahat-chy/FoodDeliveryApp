import { Octicons } from "@expo/vector-icons";
import { useContext, useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { colorScheme, setColorScheme } = useContext(ThemeContext)!;
  const translateX = useRef(
    new Animated.Value(colorScheme === "dark" ? 30 : 0)
  ).current;

  // 🔹 Animate knob when theme changes
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: colorScheme === "dark" ? 30 : 0,
      useNativeDriver: true,
    }).start();
  }, [colorScheme]);

  return (
    <View style={styles.themeToggleContainer}>
      <Pressable
        onPress={() =>
          setColorScheme(colorScheme === "light" ? "dark" : "light")
        }
        style={styles.switchTrack}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: colorScheme === "dark" ? "#333" : "#eee",
              borderRadius: 25,
            },
          ]}
        />
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]}>
          <Octicons
            name={colorScheme === "dark" ? "moon" : "sun"}
            size={20}
            color={colorScheme === "dark" ? "cyan" : "orange"}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  switchTrack: {
    width: 60,
    height: 30,
    borderRadius: 25,
    justifyContent: "center",
    padding: 3,
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    elevation: 3,
  },
  themeToggleContainer: {
    flex: 1,
    alignItems: "flex-end",
    padding: 12,
  },
});
