import ThemeToggle from "@/components/ThemeToggle";
import { Menu_Items, MenuItem } from "@/constants/MenuItems";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  Appearance,
  Dimensions,
  Image,
  Platform,
  Animated as RNAnimated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ThemeContext } from "../../context/ThemeContext";
import { NetworkStatusBanner } from "../networkStatusBanner";

const { width, height } = Dimensions.get("window");

export default function TabTwoScreen() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error("ThemeContext must be used inside ThemeProvider");
  }

  const { colorScheme, setColorScheme, theme } = themeContext;

  const styles = createStyles(theme, colorScheme);
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("FoodDeliveryApp");
        const storageItems = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageItems && storageItems.length) {
          setMenuItems(
            storageItems.sort((a: MenuItem, b: MenuItem) => a.id - b.id)
          );
        } else {
          setMenuItems(Menu_Items.sort((a, b) => a.id - b.id));
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [Menu_Items]);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(menuItems);
        await AsyncStorage.setItem("FoodDeliveryApp", jsonValue);
      } catch (e) {
        console.log(e);
      }
    };

    storeData();
  }, [menuItems]);

  const removeItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const showYesNoAlert = (id: number) => {
    Vibration.vibrate([2000, 1000, 2000]);

    const message = "Are you sure you want to Delete this item?";

    if (Platform.OS === "web") {
      const confirmResult = window.confirm(message);
      if (confirmResult) {
        removeItem(id);
      }
    } else {
      Alert.alert(
        "Confirm Action",
        message,
        [
          { text: "No", style: "cancel" },
          { text: "Yes", onPress: () => removeItem(id) },
        ],
        { cancelable: false }
      );
    }
  };

  const translateX = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.spring(translateX, {
      toValue: colorScheme === "dark" ? 30 : 0,
      useNativeDriver: true,
    }).start();

    navigation.setOptions({
      tabBarStyle: {
        backgroundColor: colorScheme === "dark" ? "black" : "white",
      },
    });
  }, [colorScheme]);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  }, [setColorScheme]);

  const viewDetails = (id: number) => {
    router.push({
      pathname: "/menuDetails/[id]",
      params: { id: String(id) },
    });
  };

  return (
    <Container style={{ flex: 1, backgroundColor: theme.background }}>
      <View>
        <NetworkStatusBanner />
        <ThemeToggle />
        <Text
          onPress={() =>
            router.push({
              pathname: "/createUpdate",
              params: { id: "create" },
            })
          }
          style={styles.addText}
        >
          Add a New Item
        </Text>
      </View>
      <Animated.FlatList
        data={menuItems}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() => (
          <Text style={{ color: theme.text, paddingTop: 15 }}>
            ~~~~~~~~~~ . ~~~~~~~~~~
          </Text>
        )}
        ListFooterComponentStyle={styles.footerComponent}
        ListEmptyComponent={() => (
          <Text style={{ color: theme.text, textAlign: "center" }}>
            No Items to Show!
          </Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.image && (
              <Image
                style={styles.menuImage}
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
              />
            )}

            <View style={styles.menuTextRow}>
              <Text style={[styles.menuItemTitle, styles.menuItemText]}>
                {item.title}
              </Text>
              <Text style={styles.menuItemText}>{item.description}</Text>

              <View style={{ flexDirection: "row" }}>
                <Pressable onPress={() => viewDetails(item.id)}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </Pressable>
              </View>
            </View>

            <View style={{ flexDirection: "column" }}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/createUpdate",
                    params: { id: item.id },
                  })
                }
                style={{
                  paddingTop: width * 0.05,
                  paddingLeft: width * 0.015,
                  paddingRight: width * 0.015,
                }}
              >
                <MaterialIcons
                  name="mode-edit"
                  size={24}
                  color={colorScheme === "dark" ? "cyan" : "orange"}
                />
              </Pressable>
              <Pressable
                onPress={() => showYesNoAlert(item.id)}
                style={{
                  paddingTop: width * 0.03,
                  paddingLeft: width * 0.015,
                  paddingRight: width * 0.015,
                }}
              >
                <MaterialIcons name="delete" size={24} color="red" />
              </Pressable>
            </View>
          </View>
        )}
      />
    </Container>
  );
}

function createStyles(theme: any, colorScheme: any) {
  return StyleSheet.create({
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
    },
    separator: {
      height: 1,
      backgroundColor: colorScheme === "dark" ? "papayawhip" : "#000",
      width: "50%",
      maxWidth: 300,
      marginHorizontal: "auto",
      marginBottom: 10,
    },
    footerComponent: {
      marginHorizontal: "auto",
    },
    row: {
      flexDirection: "row",
      width: "100%",
      maxWidth: 600,
      height: height * 0.2,
      marginBottom: 10,
      borderStyle: "solid",
      borderColor: colorScheme === "dark" ? "papayawhip" : "#000",
      borderWidth: 1,
      borderRadius: 20,
      overflow: "hidden",
      marginHorizontal: "auto",
    },
    menuTextRow: {
      width: "65%",
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 5,
      flexGrow: 1,
    },
    menuItemTitle: {
      fontSize: 18,
      textDecorationLine: "underline",
    },
    menuItemText: {
      color: theme.text,
    },
    menuImage: {
      width: "25%",
      height: "100%",
    },
    addText: {
      color: colorScheme === "dark" ? "orange" : "blue",
      fontWeight: "bold",
      textDecorationLine: "underline",
      paddingLeft: width * 0.05,
      paddingBottom: height * 0.02,
    },
    switchTrack: {
      width: 60,
      height: 30,
      borderRadius: 25,
      justifyContent: "center",
      padding: 3,
      marginLeft: width * 0.82,
      marginTop: height * 0.01,
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
    viewDetailsText: {
      color: colorScheme === "dark" ? "orange" : "blue",
      textDecorationLine: "underline",
      paddingTop: 7,
    },
  });
}
