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
    loadSite();
  }, []);

  const loadSite = async () => {
    try {
      const site = await AsyncStorage.getItem("currentSiteId");
      if (!site) {
        Alert.alert("Error", "No site selected.");
        navigation.navigate("Home");
        return;
      }
      setCurrentSiteId(site);
    } catch (err) {
      Alert.alert("Error", "Failed to load site context.");
      navigation.navigate("Home");
    }
  };

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
    try {
      const { status } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Camera permission required."
        );
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        quality: 0.7,
      });

      if (!res.canceled && res.assets?.length) {
        setPhotos((p) => ({
          ...p,
          [key]: res.assets[0].uri,
        }));
      }
    } catch (err) {
      Alert.alert("Camera error", "Unable to capture photo.");
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

  const allComplete =
    floraComplete && faunaComplete && photosComplete;

  /* ---------- SAVE & FINISH ---------- */
  const onFinish = async () => {
    if (!allComplete) {
      Alert.alert(
        "Incomplete",
        "Complete flora, fauna, and photos before finishing."
      );
      return;
    }

    try {
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
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to save ground truth data."
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title={`Ground Truthing (${currentSiteId})`}
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      {/* TABS */}
      <View style={styles.tabs}>
        {["flora", "fauna", "photos"].map((t) => {
          const disabled =
            (t === "fauna" && !floraComplete) ||
            (t === "photos" && !faunaComplete);

          return (
            <TouchableOpacity
              key={t}
              disabled={disabled}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    tab === t ? "#2ecc71" : colors.card,
                  opacity: disabled ? 0.4 : 1,
                },
              ]}
              onPress={() => setTab(t)}
            >
              <Text
                style={{
                  color: tab === t ? "#fff" : colors.text,
                }}
              >
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* ---------- FLORA ---------- */}
        {tab === "flora" && (
          <>
            <Dropdown
              label="Dominant vegetation type"
              value={vegType}
              options={[
                "Dense Forest",
                "Open Woodland",
                "Scrubland",
                "Grassland",
                "Wetland",
                "Plantation",
                "Agriculture",
                "Mixed",
              ]}
              onSelect={setVegType}
              colors={colors}
            />

            <Dropdown
              label="Canopy cover"
              value={canopyCover}
              options={["<25%", "25-50%", "50-75%", ">75%"]}
              onSelect={setCanopyCover}
              colors={colors}
            />

            <Dropdown
              label="Canopy height"
              value={canopyHeight}
              options={["<5m", "5-15m", "15-25m", ">25m"]}
              onSelect={setCanopyHeight}
              colors={colors}
            />

            <Text style={[styles.h, { color: colors.text }]}>
              Understory density
            </Text>
            {["Sparse", "Moderate", "Dense"].map((v) => (
              <Option
                key={v}
                value={v}
                selected={understory}
                set={setUnderstory}
                colors={colors}
              />
            ))}

            <Text style={[styles.h, { color: colors.text }]}>
              Ecological stress observed?
            </Text>
            <View style={styles.row}>
              <Toggle
                label="Yes"
                active={stressObserved}
                onPress={() => setStressObserved(true)}
                colors={colors}
              />
              <Toggle
                label="No"
                active={!stressObserved}
                onPress={() => {
                  setStressObserved(false);
                  setStressNote("");
                }}
                colors={colors}
              />
            </View>

            {stressObserved && (
              <TextInput
                placeholder="Describe observed stress"
                placeholderTextColor="#888"
                value={stressNote}
                onChangeText={setStressNote}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
              />
            )}

            <PhotoRow
              label="Canopy photo (mandatory)"
              uri={photos.canopy}
              onPress={() => takePhoto("canopy")}
            />

            <ProceedBtn
              enabled={floraComplete}
              label="Flora complete → Proceed to Fauna"
              onPress={() => setTab("fauna")}
            />
          </>
        )}

        {/* ---------- FAUNA ---------- */}
        {tab === "fauna" && (
          <>
            <Text style={[styles.h, { color: colors.text }]}>
              Bird activity level
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

            <TextInput
              placeholder="Bird species observed (optional)"
              placeholderTextColor="#888"
              value={birdNotes}
              onChangeText={setBirdNotes}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
            />

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

            <ProceedBtn
              enabled={faunaComplete}
              label="Fauna complete → Proceed to Photos"
              onPress={() => setTab("photos")}
            />
          </>
        )}

        {/* ---------- PHOTOS ---------- */}
        {tab === "photos" && (
          <>
            <PhotoRow
              label="Landscape photo (mandatory)"
              uri={photos.landscape}
              onPress={() => takePhoto("landscape")}
            />
            <PhotoRow
              label="Canopy photo (mandatory)"
              uri={photos.canopy}
              onPress={() => takePhoto("canopy")}
            />
            <PhotoRow
              label="Device placement photo (mandatory)"
              uri={photos.device}
              onPress={() => takePhoto("device")}
            />
            {stressObserved && (
              <PhotoRow
                label="Disturbance photo (mandatory)"
                uri={photos.disturbance}
                onPress={() => takePhoto("disturbance")}
              />
            )}

            <ProceedBtn
              enabled={photosComplete}
              label="Complete site → Proceed"
              onPress={onFinish}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- helpers ---------- */

function Dropdown({ label, value, options, onSelect, colors }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.h, { color: colors.text }]}>
        {label}
      </Text>
      <TouchableOpacity
        style={[
          styles.dropdown,
          {
            borderColor: value ? "#2ecc71" : colors.border,
          },
        ]}
        onPress={() => setOpen(!open)}
      >
        <Text style={{ color: value ? colors.text : "#888" }}>
          {value || "Select"}
        </Text>
      </TouchableOpacity>

      {open &&
        options.map((o) => {
          const active = o === value;
          return (
            <TouchableOpacity
              key={o}
              style={[
                styles.option,
                {
                  backgroundColor: active
                    ? "#2ecc71"
                    : colors.card,
                  borderColor: active
                    ? "#2ecc71"
                    : colors.border,
                },
              ]}
              onPress={() => {
                onSelect(o);
                setOpen(false);
              }}
            >
              <Text
                style={{
                  color: active ? "#fff" : colors.text,
                }}
              >
                {o}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
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
          backgroundColor: active
            ? "#2ecc71"
            : "transparent",
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

function Toggle({ label, active, onPress, colors }) {
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

function PhotoRow({ label, uri, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.photoRow, { borderColor: "#999" }]}
      onPress={onPress}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.thumb} />
      ) : (
        <Text style={styles.tapText}>Tap</Text>
      )}
      <Text style={styles.photoLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function ProceedBtn({ enabled, label, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.finish,
        { opacity: enabled ? 1 : 0.4 },
      ]}
      disabled={!enabled}
      onPress={onPress}
    >
      <Text style={styles.finishText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },
  tabs: { flexDirection: "row", padding: 10 },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  h: { marginTop: 8, marginBottom: 6, fontWeight: "600" },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  row: { flexDirection: "row", marginBottom: 8 },
  toggle: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 0.5,
    borderRadius: 8,
    marginBottom: 10,
  },
  photoLabel: { fontSize: 14, color: "#999" },
  tapText: { color: "#999" },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  finish: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#2ecc71",
    alignItems: "center",
  },
  finishText: { color: "#fff", fontWeight: "600" },
});
