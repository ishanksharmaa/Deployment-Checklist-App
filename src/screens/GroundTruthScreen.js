import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";

const VEGETATION_TYPES = [
  "Dense Forest",
  "Open Woodland",
  "Scrubland",
  "Grassland",
  "Wetland",
  "Plantation",
  "Agriculture",
  "Mixed",
];

export default function GroundTruthScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [vegType, setVegType] = useState("");
  const [stressYes, setStressYes] = useState(false);
  const [stressNote, setStressNote] = useState("");

  const [photos, setPhotos] = useState({
    landscape: null,
    canopy: null,
    device: null,
    disturbance: null,
  });

  const takePhoto = async (key) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled) {
      setPhotos((p) => ({ ...p, [key]: result.assets[0].uri }));
    }
  };

  const onComplete = async () => {
    if (!vegType) {
      Alert.alert("Missing info", "Select vegetation type.");
      return;
    }
    if (stressYes && !stressNote.trim()) {
      Alert.alert("Details needed", "Describe observed stress.");
      return;
    }
    if (!photos.landscape || !photos.canopy || !photos.device) {
      Alert.alert(
        "Photos missing",
        "Landscape, canopy and device photos are required."
      );
      return;
    }
    // step 6 complete
    await setCurrentStep(7);
    navigation.goBack();
    // next = Site Summary
  };

  return (
      <ScrollView
    style={{ backgroundColor: colors.background }}
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
  >
      <Text style={[styles.title, { color: colors.text }]}>
        Ground Truthing & Photos
      </Text>

      <Text style={[styles.sub, { color: colors.text }]}>
        Dominant vegetation type
      </Text>

      {VEGETATION_TYPES.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.option,
            { borderColor: vegType === item ? "#2ecc71" : colors.border },
          ]}
          onPress={() => setVegType(item)}
        >
          <View
            style={[
              styles.circle,
              { backgroundColor: vegType === item ? "#2ecc71" : "transparent" },
            ]}
          >
            {vegType === item && <Text style={styles.tick}>✓</Text>}
          </View>
          <Text style={[styles.optionText, { color: colors.text }]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sub, { color: colors.text, marginTop: 10 }]}>
        Ecological stress observed?
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.choice,
            { backgroundColor: stressYes ? "#2ecc71" : colors.card },
          ]}
          onPress={() => setStressYes(true)}
        >
          <Text style={{ color: stressYes ? "#fff" : colors.text }}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choice,
            { backgroundColor: !stressYes ? "#2ecc71" : colors.card },
          ]}
          onPress={() => setStressYes(false)}
        >
          <Text style={{ color: !stressYes ? "#fff" : colors.text }}>No</Text>
        </TouchableOpacity>
      </View>

      {stressYes && (
        <TextInput
          placeholder="Describe stress (short)"
          placeholderTextColor="#888"
          value={stressNote}
          onChangeText={setStressNote}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
        />
      )}

      <Text style={[styles.sub, { color: colors.text, marginTop: 12 }]}>
        Photo documentation
      </Text>

      <PhotoRow
        label="Landscape (required)"
        uri={photos.landscape}
        onPress={() => takePhoto("landscape")}
        colors={colors}
      />
      <PhotoRow
        label="Canopy (required)"
        uri={photos.canopy}
        onPress={() => takePhoto("canopy")}
        colors={colors}
      />
      <PhotoRow
        label="Device placement (required)"
        uri={photos.device}
        onPress={() => takePhoto("device")}
        colors={colors}
      />
      <PhotoRow
        label="Disturbance (optional)"
        uri={photos.disturbance}
        onPress={() => takePhoto("disturbance")}
        colors={colors}
      />

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#2ecc71" }]}
        onPress={onComplete}
      >
        <Text style={styles.btnText}>Save & proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function PhotoRow({ label, uri, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.photoRow,
        { borderColor: uri ? "#2ecc71" : colors.border },
      ]}
      onPress={onPress}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.thumb} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={{ color: "#888" }}>Tap</Text>
        </View>
      )}
      <Text style={[styles.photoText, { color: colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  sub: { fontSize: 14, marginBottom: 6 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#2ecc71",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  tick: { color: "#fff", fontSize: 12, fontWeight: "600" },
  optionText: { flex: 1, fontSize: 14 },
  row: { flexDirection: "row", marginBottom: 8 },
  choice: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  placeholder: {
    width: 48,
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  photoText: { flex: 1, fontSize: 14 },
  btn: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
