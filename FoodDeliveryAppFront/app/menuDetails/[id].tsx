import { Menu_Items, MenuItem } from "@/constants/MenuItems";
import { ThemeContext } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function ItemDetailsScreen() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext must be used inside ThemeProvider");
  }

  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const { colorScheme, setColorScheme, theme } = themeContext;
  const styles = createStyles(theme, colorScheme);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Details of Item ${id}`,
    });
  }, [navigation, id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("FoodDeliveryApp");
        const storageItems = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageItems && storageItems.length) {
          setDetailItem(
            storageItems.find((item: any) => item.id === Number(id))
          );
        } else {
          setDetailItem(null);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [Menu_Items]);

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.titleText}>{detailItem?.title}</Text>

      {detailItem?.image && (
        <Image
          style={styles.image}
          source={
            typeof detailItem.image === "string"
              ? { uri: detailItem.image }
              : detailItem.image
          }
        />
      )}

      <Text style={styles.description}>{detailItem?.description}</Text>
    </View>
  );
}

function createStyles(theme: any, colorScheme: any) {
  return StyleSheet.create({
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    titleText: {
      fontSize: 30,
      color: colorScheme === "dark" ? "#f8e9b9ff" : "#C0B288FF",
      textDecorationLine: "underline",
      fontWeight: "bold",
      paddingBottom: 20,
    },
    image: {
      width: width * 0.9,
      height: height * 0.4,
      borderColor: colorScheme === "dark" ? "#f8e9b9ff" : "#C0B288FF",
      borderWidth: 3,
    },
    description: {
      fontSize: 18,
      color: colorScheme === "dark" ? "#e7e5dcff" : "gray",
      paddingTop: 20,
    },
  });
}
