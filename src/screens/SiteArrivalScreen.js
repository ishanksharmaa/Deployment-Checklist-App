import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";

export default function SiteArrivalScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [siteId, setSiteId] = useState("");
  const [coords, setCoords] = useState(null);
  const [arrivalTime, setArrivalTime] = useState("");
  const [hasIssue, setHasIssue] = useState(false);
  const [issueText, setIssueText] = useState("");

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
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
    setArrivalTime(new Date().toLocaleTimeString());
  };

  const onConfirm = async () => {
    if (!siteId || !coords) {
      Alert.alert("Missing info", "Please enter Site ID and confirm GPS.");
      return;
    }
    if (hasIssue && !issueText.trim()) {
      Alert.alert("Details needed", "Please describe the access issue.");
      return;
    }

    // unlock next step
    await setCurrentStep(3);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Site Arrival Setup
      </Text>

      <TextInput
        placeholder="Enter Site ID (e.g. C1-S3)"
        placeholderTextColor="#888"
        value={siteId}
        onChangeText={setSiteId}
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
      />

      <View style={styles.box}>
        <Text style={{ color: colors.text }}>
          GPS: {coords ? "Captured" : "Waiting"}
        </Text>
        {coords && (
          <Text style={{ color: colors.text, marginTop: 6 }}>
            Lat {coords.lat.toFixed(5)}, Lng {coords.lng.toFixed(5)}
          </Text>
        )}
        {arrivalTime ? (
          <Text style={{ color: colors.text, marginTop: 6 }}>
            Time: {arrivalTime}
          </Text>
        ) : null}
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.choice,
            { backgroundColor: hasIssue ? "#e74c3c" : colors.card },
          ]}
          onPress={() => setHasIssue(true)}
        >
          <Text style={{ color: hasIssue ? "#fff" : colors.text }}>
            Access Issue: Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choice,
            { backgroundColor: !hasIssue ? "#2ecc71" : colors.card },
          ]}
          onPress={() => setHasIssue(false)}
        >
          <Text style={{ color: !hasIssue ? "#fff" : colors.text }}>
            Access Issue: No
          </Text>
        </TouchableOpacity>
      </View>

      {hasIssue && (
        <TextInput
          placeholder="Describe the issue"
          placeholderTextColor="#888"
          value={issueText}
          onChangeText={setIssueText}
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              marginTop: 10,
            },
          ]}
        />
      )}

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#2ecc71" }]}
        onPress={onConfirm}
      >
        <Text style={styles.btnText}>GPS confirmed → Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  box: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#00000010",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  choice: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  btn: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
