import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
const app = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/homePageBg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Ionicons name="restaurant" style={styles.titleIcon} />
        <Text style={styles.preTitle}>Welcome{"\n"}To</Text>
        <Text style={styles.title}>Rahat's{"\n"}Food Delivery</Text>

        <Link href="/menu" style={{ marginHorizontal: "auto" }} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>View Menu</Text>
          </Pressable>
        </Link>
      </ImageBackground>
    </View>
  );
};

export default app;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  preTitle: {
    color: "#f8e9b9ff",
    fontSize: 45,
    fontWeight: 400,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "cursive",
    fontStyle: "italic",
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    fontStyle: "italic",
    textAlign: "center",
    backgroundColor: "rgba(92, 92, 95, 0.7)",
    marginBottom: 60,
    fontFamily: "serif",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    padding: 10,
  },
  titleIcon: {
    color: "#f8e9b9ff",
    fontSize: 35,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  link: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
    backgroundColor: "rgba(92, 92, 95, 0.7)",
    padding: 4,
  },
  button: {
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "rgba(192, 178, 136, 1)",
    padding: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 4,
  },
});
