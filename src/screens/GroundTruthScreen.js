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
  const [treeSpecies, setTreeSpecies] = useState("");

  const [stress, setStress] = useState({
    logging: false,
    fire: false,
    grazing: false,
    erosion: false,
    invasive: false,
    none: false,
  });
  const [stressNote, setStressNote] = useState("");

  /* ---------- FAUNA ---------- */
  const [birdActivity, setBirdActivity] = useState("");
  const [birdSpecies, setBirdSpecies] = useState("");
  const [mammalSigns, setMammalSigns] = useState({
    tracks: false,
    scat: false,
    scratch: false,
    sighting: false,
    burrows: false,
    none: false,
  });
  const [otherWildlife, setOtherWildlife] = useState("");
  const [humanDisturbance, setHumanDisturbance] = useState({
    trails: false,
    vehicles: false,
    litter: false,
    grazing: false,
    encroachment: false,
    poaching: false,
    none: false,
  });
  const [noiseLevel, setNoiseLevel] = useState("");

  /* ---------- PHOTOS ---------- */
  const [photos, setPhotos] = useState({
    landscape: null,
    canopy: null,
    device: null,
    disturbance: null,
  });

  const takePhoto = async (key) => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Camera access needed.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled && res.assets?.length) {
      setPhotos((p) => ({ ...p, [key]: res.assets[0].uri }));
    }
  };

  /* ---------- VALIDATION ---------- */

  const stressObserved =
    !stress.none &&
    Object.entries(stress).some(
      ([k, v]) => k !== "none" && v
    );

  const floraComplete =
    vegType &&
    canopyCover &&
    canopyHeight &&
    understory &&
    photos.canopy &&
    (!stressObserved || (stressNote && photos.disturbance));

  const faunaComplete =
    birdActivity && noiseLevel;

  const photosComplete =
    photos.landscape &&
    photos.canopy &&
    photos.device &&
    (!stressObserved || photos.disturbance);

  const allComplete =
    floraComplete && faunaComplete && photosComplete;

  /* ---------- SAVE ---------- */
  const onFinish = async () => {
    if (!allComplete) {
      Alert.alert("Incomplete", "Complete all sections.");
      return;
    }

    await updateSite(currentSiteId, {
      groundTruth: {
        flora: {
          vegType,
          canopyCover,
          canopyHeight,
          understory,
          treeSpecies,
          stress,
          stressNote,
        },
        fauna: {
          birdActivity,
          birdSpecies,
          mammalSigns,
          otherWildlife,
          humanDisturbance,
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

      {/* TABS */}
      <View style={styles.tabs}>
        {["flora", "fauna", "photos"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.tab,
              { backgroundColor: tab === t ? "#2ecc71" : colors.card },
            ]}
            onPress={() => setTab(t)}
          >
            <Text style={{ color: tab === t ? "#fff" : colors.text }}>
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {tab === "flora" && (
          <>
            <Text style={styles.h}>Vegetation Type</Text>
            {VEG.map(v => opt(v, vegType, setVegType, colors))}

            <Text style={styles.h}>Canopy Cover</Text>
            {["<25%", "25-50%", "50-75%", ">75%"].map(v => opt(v, canopyCover, setCanopyCover, colors))}

            <Text style={styles.h}>Canopy Height</Text>
            {["<5m", "5-15m", "15-25m", ">25m"].map(v => opt(v, canopyHeight, setCanopyHeight, colors))}

            <Text style={styles.h}>Understory Density</Text>
            {["Sparse", "Moderate", "Dense"].map(v => opt(v, understory, setUnderstory, colors))}

            <TextInput
              placeholder="Tree species observed (optional)"
              value={treeSpecies}
              onChangeText={setTreeSpecies}
              style={styles.input}
            />

            <Text style={styles.h}>Ecological Stress</Text>
            {Object.keys(stress).map(k =>
              toggle(k, stress[k], () =>
                setStress({ ...stress, [k]: !stress[k], ...(k === "none" ? resetFalse(stress) : {}) })
              )
            )}

            {stressObserved && (
              <>
                <TextInput
                  placeholder="Describe stress"
                  value={stressNote}
                  onChangeText={setStressNote}
                  style={styles.input}
                />
                <PhotoRow label="Disturbance photo (mandatory)" uri={photos.disturbance} onPress={() => takePhoto("disturbance")} />
              </>
            )}

            <PhotoRow label="Canopy photo (mandatory)" uri={photos.canopy} onPress={() => takePhoto("canopy")} />
          </>
        )}

        {tab === "fauna" && (
          <>
            <Text style={styles.h}>Bird Activity</Text>
            {["Silent", "Low", "Moderate", "High"].map(v => opt(v, birdActivity, setBirdActivity, colors))}

            <TextInput
              placeholder="Bird species (comma separated)"
              value={birdSpecies}
              onChangeText={setBirdSpecies}
              style={styles.input}
            />

            <Text style={styles.h}>Ambient Noise</Text>
            {["Natural quiet", "Distant activity", "Nearby activity", "Constant noise"].map(v => opt(v, noiseLevel, setNoiseLevel, colors))}
          </>
        )}

        {tab === "photos" && (
          <>
            <PhotoRow label="Landscape" uri={photos.landscape} onPress={() => takePhoto("landscape")} />
            <PhotoRow label="Canopy" uri={photos.canopy} onPress={() => takePhoto("canopy")} />
            <PhotoRow label="Device placement" uri={photos.device} onPress={() => takePhoto("device")} />

            <TouchableOpacity style={styles.finish} onPress={onFinish}>
              <Text style={styles.finishText}>Complete Site</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ---------- helpers ---------- */

const VEG = ["Dense Forest","Open Woodland","Scrubland","Grassland","Wetland","Plantation","Agriculture","Mixed"];

const opt = (v, sel, set, colors) => (
  <TouchableOpacity
    key={v}
    style={[styles.option,{ backgroundColor: sel===v ? "#2ecc71" : "transparent" }]}
    onPress={() => set(v)}
  >
    <Text style={{ color: sel===v ? "#fff" : colors.text }}>{v}</Text>
  </TouchableOpacity>
);

const toggle = (label, active, onPress) => (
  <TouchableOpacity key={label} style={styles.option} onPress={onPress}>
    <Text>{active ? "✓ " : ""}{label}</Text>
  </TouchableOpacity>
);

const resetFalse = (obj) =>
  Object.keys(obj).reduce((a,k)=>({ ...a, [k]: false }),{});

function PhotoRow({ label, uri, onPress }) {
  return (
    <TouchableOpacity style={styles.photoRow} onPress={onPress}>
      {uri ? <Image source={{ uri }} style={styles.thumb} /> : <Text>Tap</Text>}
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container:{ padding:20 },
  tabs:{ flexDirection:"row", padding:10 },
  tab:{ flex:1, padding:10, alignItems:"center", borderRadius:6 },
  h:{ marginTop:12, marginBottom:6, fontWeight:"600" },
  option:{ padding:12, borderWidth:1, borderRadius:8, marginBottom:6 },
  input:{ borderWidth:1, borderRadius:8, padding:12, marginTop:8 },
  photoRow:{ flexDirection:"row", alignItems:"center", padding:12, borderWidth:1, marginBottom:10 },
  thumb:{ width:48, height:48, marginRight:10 },
  finish:{ marginTop:20, padding:16, backgroundColor:"#2ecc71", borderRadius:8, alignItems:"center" },
  finishText:{ color:"#fff", fontWeight:"600" },
});
