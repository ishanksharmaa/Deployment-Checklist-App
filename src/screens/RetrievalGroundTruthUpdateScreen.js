import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LightTheme, DarkTheme } from "../constants/theme";
import Header from "../components/Header";
import { updateSite } from "../storage/sitesStorage";

export default function RetrievalGroundTruthUpdateScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [siteId, setSiteId] = useState("");

  /* ---------- FIELDS ---------- */
  const [vegetationChanged, setVegetationChanged] = useState(null); // true / false
  const [notes, setNotes] = useState("");
  const [birdActivity, setBirdActivity] = useState("");
  const [noiseLevel, setNoiseLevel] = useState("");
  const [photo, setPhoto] = useState(null);

  /* ---------- LOAD SITE ---------- */
  useEffect(() => {
    loadSite();
  }, []);

  const loadSite = async () => {
    const id = await AsyncStorage.getItem("currentRetrievalSiteId");
    if (!id) {
      Alert.alert("Error", "No retrieval site selected.");
      navigation.navigate("Home");
      return;
    }
    setSiteId(id);
  };

  /* ---------- CAMERA ---------- */
  const takePhoto = async () => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission required.");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!res.canceled && res.assets?.length) {
      setPhoto(res.assets[0].uri);
    }
  };

  /* ---------- VALIDATION ---------- */
  const canProceed =
    vegetationChanged !== null &&
    birdActivity &&
    noiseLevel;

  /* ---------- SAVE ---------- */
  const onComplete = async () => {
    if (!canProceed) {
      Alert.alert(
        "Incomplete",
        "Please complete required fields."
      );
      return;
    }

    try {
      await updateSite(siteId, {
        retrieval: {
          groundTruthUpdate: {
            vegetationChanged,
            notes,
            birdActivity,
            noiseLevel,
            photo,
          },
        },
      });

      navigation.navigate("RetrievalSummary");
    } catch {
      Alert.alert("Error", "Failed to save ground truth update.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title={`Retrieval Ground Truth (${siteId})`}
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* VEGETATION CHANGE */}
        <Text style={[styles.h, { color: colors.text }]}>
          Vegetation condition changed since deployment?
        </Text>

        <View style={styles.row}>
          <ToggleBtn
            label="Yes"
            active={vegetationChanged === true}
            onPress={() => setVegetationChanged(true)}
            colors={colors}
          />
          <ToggleBtn
            label="No"
            active={vegetationChanged === false}
            onPress={() => setVegetationChanged(false)}
            colors={colors}
          />
        </View>

        {/* NOTES */}
        <TextInput
          placeholder="Notes on habitat changes (optional)"
          placeholderTextColor="#888"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              height: 90,
            },
          ]}
        />

        {/* BIRD ACTIVITY */}
        <Text style={[styles.h, { color: colors.text }]}>
          Bird activity level today
        </Text>

        {["Silent", "Low", "Moderate", "High"].map((v) => (
          <Option
            key={v}
            value={v}
            selected={birdActivity}
            set={setBirdActivity}
            colors={colors}
          />
        ))}

        {/* NOISE LEVEL */}
        <Text style={[styles.h, { color: colors.text }]}>
          Ambient noise level
        </Text>

        {[
          "Natural quiet",
          "Distant activity",
          "Nearby activity",
          "Constant noise",
        ].map((v) => (
          <Option
            key={v}
            value={v}
            selected={noiseLevel}
            set={setNoiseLevel}
            colors={colors}
          />
        ))}

        {/* PHOTO */}
        <Text style={[styles.h, { color: colors.text }]}>
          Optional photo (if major changes observed)
        </Text>

        <TouchableOpacity
          style={[styles.photoBox, { borderColor: colors.border }]}
          onPress={takePhoto}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Text style={{ color: "#888" }}>Tap to capture photo</Text>
          )}
        </TouchableOpacity>

        {/* COMPLETE */}
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: canProceed
                ? "#2ecc71"
                : colors.border,
              opacity: canProceed ? 1 : 0.6,
            },
          ]}
          disabled={!canProceed}
          onPress={onComplete}
        >
          <Text style={styles.btnText}>
            Ground truth update complete → Proceed
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function ToggleBtn({ label, active, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.toggle,
        {
          backgroundColor: active ? "#2ecc71" : colors.card,
        },
      ]}
      onPress={onPress}
    >
      <Text style={{ color: active ? "#fff" : colors.text }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Option({ value, selected, set, colors }) {
  const active = value === selected;
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          borderColor: active ? "#2ecc71" : colors.border,
          backgroundColor: active ? "#2ecc71" : "transparent",
        },
      ]}
      onPress={() => set(value)}
    >
      <Text style={{ color: active ? "#fff" : colors.text }}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },

  h: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  toggle: {
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
    marginBottom: 12,
  },

  option: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 8,
  },

  photoBox: {
    height: 140,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  btn: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
