import { Menu_Items, MenuItem } from "@/constants/MenuItems";
import { ThemeContext } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function createUpdateScreen() {
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
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: id !== "create" ? "Update Item" : "Create Item",
    });
  }, [navigation, id]);

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
    if (id !== "create") {
      const initatingItem = menuItems.find((item) => item.id === Number(id));
      if (initatingItem) {
        setTitle(initatingItem.title);
        setDescription(initatingItem.description);

        if (initatingItem.image) {
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
    }
  }, [menuItems]);

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

      router.push("/menu");
    } else {
      showAlert();
    }
  };

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

  const cancelItem = () => {
    setTitle("");
    setDescription("");
    setImageUri(null);
    router.push("/menu");
  };

  const updateItem = () => {
    if (title.trim()) {
      const updateableItemIndex: number = menuItems.findIndex(
        (item) => item.id === Number(id)
      );

      const updatedItems = [...menuItems]; // new array reference
      updatedItems[updateableItemIndex] = {
        ...updatedItems[updateableItemIndex],
        title,
        description,
        image: imageUri,
      };

      setMenuItems(updatedItems);

      setTitle("");
      setDescription("");
      setImageUri(null);

      router.push("/menu");
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

  return (
    <Container style={{ flex: 1, backgroundColor: theme.background }}>
      <View>
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
        {id !== "create" ? (
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
    </Container>
  );
}

function createStyles(theme: any, colorScheme: any) {
  return StyleSheet.create({
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
  });
}
