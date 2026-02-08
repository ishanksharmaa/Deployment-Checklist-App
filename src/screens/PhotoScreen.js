import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";

export default function PhotoScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [photos, setPhotos] = useState({
    landscape: null,
    canopy: null,
    device: null,
    disturbance: null,
  });

  const pickPhoto = async (key) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      exif: false,
    });

    if (!result.canceled) {
      setPhotos((p) => ({ ...p, [key]: result.assets[0].uri }));
    }
  };

  const onComplete = async () => {
    if (!photos.landscape || !photos.canopy || !photos.device) {
      Alert.alert(
        "Photos missing",
        "Landscape, canopy and device photos are required."
      );
      return;
    }
    await setCurrentStep(8); // next = Site Summary
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Photo Documentation
      </Text>

      <PhotoItem
        label="Landscape photo (required)"
        uri={photos.landscape}
        onPress={() => pickPhoto("landscape")}
        colors={colors}
      />
      <PhotoItem
        label="Canopy photo (required)"
        uri={photos.canopy}
        onPress={() => pickPhoto("canopy")}
        colors={colors}
      />
      <PhotoItem
        label="Device placement photo (required)"
        uri={photos.device}
        onPress={() => pickPhoto("device")}
        colors={colors}
      />
      <PhotoItem
        label="Disturbance photo (optional)"
        uri={photos.disturbance}
        onPress={() => pickPhoto("disturbance")}
        colors={colors}
      />

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#2ecc71" }]}
        onPress={onComplete}
      >
        <Text style={styles.btnText}>Photos saved → Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

function PhotoItem({ label, uri, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        { borderColor: uri ? "#2ecc71" : colors.border },
      ]}
      onPress={onPress}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.thumb} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: "#888" }}>Tap to capture</Text>
        </View>
      )}
      <Text style={[styles.itemText, { color: colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  placeholder: {
    width: 56,
    height: 56,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 6,
    marginRight: 12,
  },
  itemText: { flex: 1, fontSize: 14 },
  btn: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
