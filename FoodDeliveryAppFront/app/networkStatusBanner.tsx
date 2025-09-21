import React from "react";
import { Text, View } from "react-native";
import { useNetwork } from "../context/NetworkProviderContext";

export const NetworkStatusBanner = () => {
  const { isConnected } = useNetwork();

  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: isConnected ? "#8ce783ff" : "#e05353ff",
      }}
    >
      <Text style={{ color: "white" }}>
        {isConnected ? "You are online ✅" : "No internet connection ❌"}
      </Text>
    </View>
  );
};
