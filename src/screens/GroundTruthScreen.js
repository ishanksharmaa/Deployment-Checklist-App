import React, { useState, useEffect } from "react";
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
import { setCurrentStep } from "../storage/progressStorage";
import { updateSite, markSiteCompleted } from "../storage/sitesStorage";
import Header from "../components/Header";

export default function GroundTruthScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [tab, setTab] = useState("flora");
  const [currentSiteId, setCurrentSiteId] = useState("");

  /* ---------- LOAD SITE ---------- */
  useEffect(() => {
    (async () => {
      const site = await AsyncStorage.getItem("currentSiteId");
      if (!site) {
        Alert.alert("Error", "No site selected.");
        navigation.navigate("Home");
        return;
      }
      setCurrentSiteId(site);
    })();
  }, []);

  /* ---------- FLORA ---------- */
  const [vegType, setVegType] = useState("");
  const [canopyCover, setCanopyCover] = useState("");
  const [canopyHeight, setCanopyHeight] = useState("");
  const [understory, setUnderstory] = useState("");
  const [stressObserved, setStressObserved] = useState(false);
  const [stressNote, setStressNote] = useState("");

  /* ---------- FAUNA ---------- */
  const [birdActivity, setBirdActivity] = useState("");
  const [birdNotes, setBirdNotes] = useState("");
  const [noiseLevel, setNoiseLevel] = useState("");

  /* ---------- PHOTOS ---------- */
  const [photos, setPhotos] = useState({
    landscape: null,
    canopy: null,
    device: null,
    disturbance: null,
  });

  const takePhoto = async (key) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission required.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled && res.assets?.length) {
      setPhotos((p) => ({ ...p, [key]: res.assets[0].uri }));
    }
  };

  /* ---------- VALIDATION ---------- */
  const floraComplete =
    vegType &&
    canopyCover &&
    canopyHeight &&
    understory &&
    photos.canopy &&
    (!stressObserved || stressNote.trim());

  const faunaComplete = birdActivity && noiseLevel;

  const photosComplete =
    photos.landscape &&
    photos.canopy &&
    photos.device &&
    (!stressObserved || photos.disturbance);

  /* ---------- FINISH ---------- */
  const onFinish = async () => {
    if (!floraComplete || !faunaComplete || !photosComplete) {
      Alert.alert("Incomplete", "Complete all steps.");
      return;
    }

    await updateSite(currentSiteId, {
      groundTruth: {
        flora: {
          vegType,
          canopyCover,
          canopyHeight,
          understory,
          stressObserved,
          stressNote,
        },
        fauna: {
          birdActivity,
          birdNotes,
          noiseLevel,
        },
        photos,
        completedAt: new Date().toISOString(),
      },
    });

    await markSiteCompleted(currentSiteId);
    await setCurrentStep(2);
    navigation.replace("SiteSummary");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title={`Ground Truthing (${currentSiteId})`}
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      {/* ---------- TABS (LOCKED FLOW) ---------- */}
      <View style={styles.tabs}>
        <Tab label="FLORA" active={tab === "flora"} />
        <Tab label="FAUNA" active={tab === "fauna"} disabled={!floraComplete} />
        <Tab label="PHOTOS" active={tab === "photos"} disabled={!faunaComplete} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* ---------- FLORA ---------- */}
        {tab === "flora" && (
          <>
            <Dropdown label="Vegetation Type" value={vegType}
              options={VEG} onSelect={setVegType} colors={colors} />

            <Dropdown label="Canopy Cover" value={canopyCover}
              options={["<25%", "25-50%", "50-75%", ">75%"]}
              onSelect={setCanopyCover} colors={colors} />

            <Dropdown label="Canopy Height" value={canopyHeight}
              options={["<5m", "5-15m", "15-25m", ">25m"]}
              onSelect={setCanopyHeight} colors={colors} />

            <Dropdown label="Understory Density" value={understory}
              options={["Sparse", "Moderate", "Dense"]}
              onSelect={setUnderstory} colors={colors} />

            <PhotoRow label="Canopy photo (mandatory)"
              uri={photos.canopy} onPress={() => takePhoto("canopy")} />

            <ProceedBtn enabled={floraComplete}
              label="Proceed to Fauna"
              onPress={() => setTab("fauna")} />
          </>
        )}

        {/* ---------- FAUNA ---------- */}
        {tab === "fauna" && (
          <>
            <Dropdown label="Bird Activity" value={birdActivity}
              options={["Silent", "Low", "Moderate", "High"]}
              onSelect={setBirdActivity} colors={colors} />

            <Dropdown label="Ambient Noise" value={noiseLevel}
              options={[
                "Natural quiet",
                "Distant activity",
                "Nearby activity",
                "Constant noise",
              ]}
              onSelect={setNoiseLevel} colors={colors} />

            <ProceedBtn enabled={faunaComplete}
              label="Proceed to Photos"
              onPress={() => setTab("photos")} />
          </>
        )}

        {/* ---------- PHOTOS ---------- */}
        {tab === "photos" && (
          <>
            <PhotoRow label="Landscape" uri={photos.landscape}
              onPress={() => takePhoto("landscape")} />
            <PhotoRow label="Device placement" uri={photos.device}
              onPress={() => takePhoto("device")} />

            <ProceedBtn enabled={photosComplete}
              label="Complete Site"
              onPress={onFinish} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- HELPERS ---------- */

const VEG = [
  "Dense Forest","Open Woodland","Scrubland",
  "Grassland","Wetland","Plantation",
  "Agriculture","Mixed"
];

function Dropdown({ label, value, options, onSelect, colors }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.h}>{label}</Text>
      <TouchableOpacity style={styles.dropdown}
        onPress={() => setOpen(!open)}>
        <Text>{value || "Select"}</Text>
      </TouchableOpacity>
      {open &&
        options.map((o) => (
          <TouchableOpacity key={o} style={styles.option}
            onPress={() => { onSelect(o); setOpen(false); }}>
            <Text>{o}</Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}

function PhotoRow({ label, uri, onPress }) {
  return (
    <TouchableOpacity style={styles.photoRow} onPress={onPress}>
      {uri ? <Image source={{ uri }} style={styles.thumb} /> : <Text>Tap</Text>}
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

function ProceedBtn({ enabled, label, onPress }) {
  return (
    <TouchableOpacity
      disabled={!enabled}
      onPress={onPress}
      style={[styles.finish, { opacity: enabled ? 1 : 0.4 }]}
    >
      <Text style={styles.finishText}>{label}</Text>
    </TouchableOpacity>
  );
}

function Tab({ label, active, disabled }) {
  return (
    <View style={[
      styles.tab,
      { opacity: disabled ? 0.4 : 1,
        backgroundColor: active ? "#2ecc71" : "#ddd" }
    ]}>
      <Text>{label}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },
  tabs: { flexDirection: "row", padding: 10 },
  tab: { flex: 1, padding: 10, alignItems: "center", borderRadius: 6 },
  h: { marginBottom: 6, fontWeight: "600" },
  dropdown: { borderWidth: 0.5, padding: 12, borderRadius: 8 },
  option: { padding: 12, borderWidth: 1, marginTop: 6, borderRadius: 8 },
  photoRow: { flexDirection: "row", padding: 12, borderWidth: 1, marginBottom: 10 },
  thumb: { width: 48, height: 48, marginRight: 10 },
  finish: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    alignItems: "center",
  },
  finishText: { color: "#fff", fontWeight: "600" },
});
