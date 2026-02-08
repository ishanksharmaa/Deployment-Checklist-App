import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";
import Header from "../components/Header";

export default function DocumentationScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [currentSiteId, setCurrentSiteId] = useState("");

  const [coords, setCoords] = useState(null);
  const [timeDeployed, setTimeDeployed] = useState("");

  const [weather, setWeather] = useState("");
  const [wind, setWind] = useState("");

  const [weatherOpen, setWeatherOpen] = useState(false);
  const [windOpen, setWindOpen] = useState(false);

  const [recentRain, setRecentRain] = useState(null);
  const [rainNote, setRainNote] = useState("");
  const [disturbance, setDisturbance] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadSite();
    captureLocationFast();
  }, []);

  const loadSite = async () => {
    const site = await AsyncStorage.getItem("currentSiteId");
    if (!site) {
      Alert.alert("Error", "No active site found.");
      navigation.navigate("Home");
      return;
    }
    setCurrentSiteId(site);
  };

  const captureLocationFast = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Location permission required.");
      return;
    }

    const last = await Location.getLastKnownPositionAsync();
    const loc =
      last ||
      (await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }));

    setCoords({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
      acc: loc.coords.accuracy,
    });

    setTimeDeployed(new Date().toLocaleString());
  };

  const canProceed =
    coords &&
    weather &&
    wind &&
    recentRain !== null &&
    (!recentRain || rainNote.trim());

  const onComplete = async () => {
    if (!canProceed) {
      Alert.alert("Incomplete", "Please complete required fields.");
      return;
    }

    const payload = {
      coords,
      timeDeployed,
      weather,
      wind,
      recentRain,
      rainNote: recentRain ? rainNote : "",
      disturbance,
      notes,
    };

    const raw = await AsyncStorage.getItem("site_docs");
    const docs = raw ? JSON.parse(raw) : {};

    docs[currentSiteId] = payload;

    await AsyncStorage.setItem("site_docs", JSON.stringify(docs));

    await setCurrentStep(6);
    navigation.navigate("GroundTruth");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title={`Deployment Documentation (${currentSiteId})`}
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.box, { backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text }}>GPS Coordinates</Text>

          {coords ? (
            <Text style={{ color: colors.text, marginTop: 6 }}>
              Lat: {coords.lat.toFixed(5)}{"\n"}
              Lng: {coords.lng.toFixed(5)}{"\n"}
              Accuracy: ±{Math.round(coords.acc)} m
            </Text>
          ) : (
            <Text style={{ color: colors.text }}>Capturing location…</Text>
          )}

          {timeDeployed && (
            <Text style={{ color: colors.text, marginTop: 6 }}>
              Time Deployed: {timeDeployed}
            </Text>
          )}
        </View>

        <Dropdown
          label="Weather at deployment"
          value={weather}
          open={weatherOpen}
          setOpen={setWeatherOpen}
          options={["Clear", "Cloudy", "Light Rain", "Heavy Rain", "Other"]}
          onSelect={setWeather}
          colors={colors}
        />

        <Text style={[styles.section, { color: colors.text }]}>
          Recent rainfall (last 24 hrs)?
        </Text>

        <View style={styles.row}>
          <ToggleBtn
            label="Yes"
            active={recentRain === true}
            onPress={() => setRecentRain(true)}
            colors={colors}
          />
          <ToggleBtn
            label="No"
            active={recentRain === false}
            onPress={() => setRecentRain(false)}
            colors={colors}
          />
        </View>

        {recentRain && (
          <TextInput
            placeholder="Describe recent rainfall"
            placeholderTextColor="#888"
            value={rainNote}
            onChangeText={setRainNote}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
          />
        )}

        <Dropdown
          label="Wind speed"
          value={wind}
          open={windOpen}
          setOpen={setWindOpen}
          options={["Calm", "Light", "Moderate", "Strong"]}
          onSelect={setWind}
          colors={colors}
        />

        <TextInput
          placeholder="Any immediate disturbances?"
          placeholderTextColor="#888"
          value={disturbance}
          onChangeText={setDisturbance}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
        />

        <TextInput
          placeholder="Field notes (optional)"
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

        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: canProceed ? "#2ecc71" : colors.border,
              opacity: canProceed ? 1 : 0.6,
            },
          ]}
          onPress={onComplete}
          disabled={!canProceed}
        >
          <Text style={styles.btnText}>
            Documentation complete → Proceed
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- helpers ---------- */

function ToggleBtn({ label, active, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.choice,
        { backgroundColor: active ? "#2ecc71" : colors.card },
      ]}
      onPress={onPress}
    >
      <Text style={{ color: active ? "#fff" : colors.text }}>{label}</Text>
    </TouchableOpacity>
  );
}

function Dropdown({ label, value, open, setOpen, options, onSelect, colors }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.section, { color: colors.text }]}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.dropdown,
          { borderColor: value ? "#2ecc71" : colors.border },
        ]}
        onPress={() => setOpen(!open)}
      >
        <Text style={{ color: value ? colors.text : "#888" }}>
          {value || "Select"}
        </Text>
      </TouchableOpacity>

      {open &&
        options.map((opt) => {
          const selected = opt === value;
          return (
            <TouchableOpacity
              key={opt}
              style={[
                styles.option,
                {
                  backgroundColor: selected ? "#2ecc71" : colors.card,
                  borderColor: selected ? "#2ecc71" : colors.border,
                },
              ]}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <Text
                style={{
                  color: selected ? "#fff" : colors.text,
                  fontWeight: selected ? "600" : "400",
                }}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },
  box: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  section: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  choice: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  btn: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
