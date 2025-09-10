import { Menu_Items, MenuItem } from "@/constants/MenuItems";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
import { Pressable, TextInput } from "react-native-gesture-handler";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ThemeContext } from "../../context/ThemeContext";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [updateableItem, setUpdateableItem] = useState<MenuItem | null>(null);
  const router = useRouter();

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

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const resetImage = async () => {
    setImageUri(null);
  };

  const addItem = () => {
    if (title.trim()) {
      const newId: number =
        menuItems.reduce((prev, current) =>
          current.id > prev.id ? current : prev
        ).id + 1;

      setMenuItems([
        {
          id: newId,
          title: title,
          description: description,
          image: imageUri,
        },
        ...menuItems,
      ]);
      cancelItem();
    } else {
      showAlert();
    }
  };

  const showAlert = () => {
    Vibration.vibrate([2000, 1000, 2000]);

    const message = "Please Insert Title";

    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert(
        "",
        message,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        {
          cancelable: true,
        }
      );
    }
  };

  const removeItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const intiateUpdate = (id: number) => {
    const initatingItem = menuItems.find((item) => item.id === id);
    if (initatingItem) {
      setUpdateableItem(initatingItem);
      setTitle(initatingItem.title);
      setDescription(initatingItem.description);
      if (initatingItem.image) {
        console.log(initatingItem.image === "string");
        console.log((initatingItem.image as any).uri);
        setImageUri(
          typeof initatingItem.image === "string"
            ? initatingItem.image
            : Platform.OS === "web"
            ? (initatingItem.image as any).uri
            : Image.resolveAssetSource(initatingItem.image).uri
        );
      } else {
        setImageUri(null);
      }
    }
  };

  const cancelItem = () => {
    setUpdateableItem(null);
    setTitle("");
    setDescription("");
    setImageUri(null);
  };

  const updateItem = () => {
    if (updateableItem && title.trim()) {
      const updateableItemIndex: number = menuItems.findIndex(
        (item) => item.id === updateableItem.id
      );
      menuItems[updateableItemIndex].title = title;
      menuItems[updateableItemIndex].description = description;
      menuItems[updateableItemIndex].image = imageUri;
      setMenuItems(menuItems);

      setUpdateableItem(null);
      setTitle("");
      setDescription("");
      setImageUri(null);
    } else {
      showAlert();
    }
  };

  const showYesNoAlert = (id: number) => {
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

  const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);

    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected);
      });

      return () => unsubscribe();
    }, []);

    return isConnected;
  };

  const isConnected = useNetworkStatus();

  return (
    <Container style={{ flex: 1, backgroundColor: theme.background }}>
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
      <View>
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
          <RNAnimated.View
            style={[styles.knob, { transform: [{ translateX }] }]}
          >
            <Octicons
              name={colorScheme === "dark" ? "moon" : "sun"}
              size={20}
              color={colorScheme === "dark" ? "cyan" : "orange"}
            />
          </RNAnimated.View>
        </Pressable>
        <TextInput
          placeholder="Add new item title"
          placeholderTextColor="gray"
          value={title}
          onChangeText={setTitle}
          style={styles.title}
        />
        <TextInput
          placeholder="Add new item description"
          placeholderTextColor="gray"
          value={description}
          onChangeText={setDescription}
          style={styles.description}
          multiline
        />
        <View style={styles.imageTextRow}>
          <Pressable onPress={pickImage}>
            <Text style={styles.pickImageText}>Pick Image</Text>
          </Pressable>
          <Pressable onPress={resetImage}>
            <Text style={styles.resetImageText}>Reset Image</Text>
          </Pressable>
        </View>

        <View style={styles.imagePreviewView}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePreviewText}>No Image Selected</Text>
          )}
        </View>
        {updateableItem ? (
          <View style={{ flexDirection: "row" }}>
            <Pressable onPress={cancelItem} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={updateItem} style={styles.updateButton}>
              <Text style={styles.updateText}>Update</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={addItem} style={styles.addButton}>
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        )}
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
                onPress={() => intiateUpdate(item.id)}
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
    title: {
      height: height * 0.05,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 15,
      padding: 7,
      margin: 10,
      fontSize: 15,
      color: colorScheme === "dark" ? "white" : "black",
    },
    description: {
      height: height * 0.09,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 15,
      padding: 7,
      margin: 10,
      marginTop: 0,
      fontSize: 15,
      textAlignVertical: "top",
      color: colorScheme === "dark" ? "white" : "black",
    },
    addButton: {
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      backgroundColor: colorScheme === "dark" ? "cyan" : "orange",
      width: width * 0.14,
      height: height * 0.052,
      marginLeft: width * 0.82,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "gray",
    },
    addText: {
      color: "white",
      fontWeight: "bold",
    },
    pickImageText: {
      color: colorScheme === "dark" ? "cyan" : "orange",
      fontWeight: "bold",
      textDecorationLine: "underline",
      marginLeft: width * 0.52,
      marginBottom: height * 0.01,
    },
    resetImageText: {
      color: colorScheme === "dark" ? "cyan" : "orange",
      fontWeight: "bold",
      textDecorationLine: "underline",
      marginLeft: width * 0.03,
      marginBottom: height * 0.01,
    },
    imagePreviewView: {
      borderWidth: 1,
      borderColor: "gray",
      height: height * 0.15,
      width: width * 0.7,
      marginLeft: width * 0.15,
      marginBottom: height * 0.01,
      justifyContent: "center",
      alignItems: "center",
    },
    imagePreview: {
      width: "100%",
      height: "100%",
    },
    imagePreviewText: {
      color: colorScheme === "dark" ? "white" : "black",
      textAlign: "center",
    },
    imageTextRow: {
      flexDirection: "row",
    },
    cancelButton: {
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      backgroundColor: "red",
      width: width * 0.19,
      height: height * 0.052,
      marginLeft: width * 0.55,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "gray",
    },
    cancelText: {
      color: "white",
      fontWeight: "bold",
    },
    updateButton: {
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      backgroundColor: "green",
      width: width * 0.19,
      height: height * 0.052,
      marginLeft: width * 0.04,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "gray",
    },
    updateText: {
      color: "white",
      fontWeight: "bold",
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
