import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";

export default function DocumentationScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [coords, setCoords] = useState(null);
  const [timeDeployed, setTimeDeployed] = useState("");
  const [weather, setWeather] = useState("");
  const [rainYes, setRainYes] = useState(false);
  const [rainNote, setRainNote] = useState("");
  const [wind, setWind] = useState("");
  const [disturbance, setDisturbance] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    captureMeta();
  }, []);

  const captureMeta = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Location permission is required.");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setCoords({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
      acc: loc.coords.accuracy,
    });
    setTimeDeployed(new Date().toLocaleString());
  };

  const onComplete = async () => {
    if (!weather || !wind || !coords) {
      Alert.alert("Missing info", "Please fill required fields.");
      return;
    }
    if (rainYes && !rainNote.trim()) {
      Alert.alert("Details needed", "Please describe recent rainfall.");
      return;
    }
    await setCurrentStep(6);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Deployment Documentation
      </Text>

      <View style={styles.box}>
        <Text style={{ color: colors.text }}>
          GPS: {coords ? "Captured" : "Loading..."}
        </Text>
        {coords && (
          <Text style={{ color: colors.text, marginTop: 6 }}>
            Lat {coords.lat.toFixed(5)}, Lng {coords.lng.toFixed(5)} (±{Math.round(coords.acc)}m)
          </Text>
        )}
        {timeDeployed ? (
          <Text style={{ color: colors.text, marginTop: 6 }}>
            Time: {timeDeployed}
          </Text>
        ) : null}
      </View>

      <TextInput
        placeholder="Weather (Clear / Cloudy / Light Rain / Heavy Rain)"
        placeholderTextColor="#888"
        value={weather}
        onChangeText={setWeather}
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
      />

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.choice,
            { backgroundColor: rainYes ? "#2ecc71" : colors.card },
          ]}
          onPress={() => setRainYes(true)}
        >
          <Text style={{ color: rainYes ? "#fff" : colors.text }}>
            Recent rainfall: Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choice,
            { backgroundColor: !rainYes ? "#2ecc71" : colors.card },
          ]}
          onPress={() => setRainYes(false)}
        >
          <Text style={{ color: !rainYes ? "#fff" : colors.text }}>
            Recent rainfall: No
          </Text>
        </TouchableOpacity>
      </View>

      {rainYes && (
        <TextInput
          placeholder="Describe rainfall"
          placeholderTextColor="#888"
          value={rainNote}
          onChangeText={setRainNote}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
        />
      )}

      <TextInput
        placeholder="Wind (Calm / Light / Moderate / Strong)"
        placeholderTextColor="#888"
        value={wind}
        onChangeText={setWind}
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
      />

      <TextInput
        placeholder="Immediate disturbances (optional)"
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
        style={[styles.btn, { backgroundColor: "#2ecc71" }]}
        onPress={onComplete}
      >
        <Text style={styles.btnText}>Documentation complete → Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  box: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#00000010",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  choice: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  btn: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
