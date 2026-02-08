import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getAllSites,
  updateSite,
} from "../storage/sitesStorage";
import { setCurrentStep } from "../storage/progressStorage";
import { LightTheme, DarkTheme } from "../constants/theme";
import Header from "../components/Header";

export default function SiteArrivalScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [sites, setSites] = useState([]);
  const [siteId, setSiteId] = useState("");
  const [open, setOpen] = useState(false);

  const [coords, setCoords] = useState(null);
  const [arrivalTime, setArrivalTime] = useState("");
  const [hasIssue, setHasIssue] = useState(false);
  const [issueText, setIssueText] = useState("");

  useEffect(() => {
    loadSites();
    captureLocationFast();
  }, []);

  /* ---------- LOAD SITES ---------- */
  const loadSites = async () => {
    const data = await getAllSites();
    setSites(data);
  };

  /* ---------- FAST GPS ---------- */
  const captureLocationFast = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const last = await Location.getLastKnownPositionAsync();
    if (last) {
      setCoords({
        lat: last.coords.latitude,
        lng: last.coords.longitude,
        acc: last.coords.accuracy,
      });
      setArrivalTime(new Date().toLocaleTimeString());
      return;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setCoords({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
      acc: loc.coords.accuracy,
    });
    setArrivalTime(new Date().toLocaleTimeString());
  };

  /* ---------- SELECT SITE ---------- */
  const selectSite = (site) => {
    if (site.completed) {
      Alert.alert(
        "Site already completed",
        "This site is already completed. View it in Site Summary."
      );
      return;
    }
    setSiteId(site.id);
    setOpen(false);
  };

  /* ---------- CONFIRM ---------- */
  const onConfirm = async () => {
    if (!siteId) {
      Alert.alert("Missing info", "Select Site ID.");
      return;
    }
    if (!coords) {
      Alert.alert("GPS missing", "Location not captured yet.");
      return;
    }
    if (hasIssue && !issueText.trim()) {
      Alert.alert("Details needed", "Describe access issue.");
      return;
    }

    // save arrival data into site object
    await updateSite(siteId, {
      arrival: {
        coords,
        time: arrivalTime,
        accessIssue: hasIssue,
        issueNote: issueText || "",
      },
    });

    // keep current site for next screens
    await AsyncStorage.setItem("currentSiteId", siteId);

    await setCurrentStep(3);
    navigation.navigate("DeviceSetup");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Site Arrival Setup"
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* SITE DROPDOWN */}
        <TouchableOpacity
          style={[styles.dropdown, { borderColor: colors.border }]}
          onPress={() => setOpen(!open)}
        >
          <Text style={{ color: siteId ? colors.text : "#888" }}>
            {siteId || "Select Site ID"}
          </Text>
        </TouchableOpacity>

        {open && (
          <View
            style={[
              styles.list,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            {sites.map((site) => (
              <TouchableOpacity
                key={site.id}
                style={[
                  styles.item,
                  site.completed && styles.disabled,
                ]}
                onPress={() => selectSite(site)}
              >
                <Text
                  style={{
                    color: site.completed ? "#999" : colors.text,
                  }}
                >
                  {site.id}
                  {site.completed ? " (completed)" : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* GPS BOX */}
        <View style={[styles.box, { backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text }}>
            GPS: {coords ? "Captured" : "Capturing location..."}
          </Text>

          {coords && (
            <Text style={{ color: colors.text, marginTop: 6 }}>
              Lat {coords.lat.toFixed(5)}, Lng {coords.lng.toFixed(5)}
            </Text>
          )}

          {arrivalTime && (
            <Text style={{ color: colors.text, marginTop: 6 }}>
              Time: {arrivalTime}
            </Text>
          )}
        </View>

        {/* ACCESS ISSUE */}
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
            placeholder="Describe access issue"
            placeholderTextColor="#888"
            value={issueText}
            onChangeText={setIssueText}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
          />
        )}

        {/* PROCEED */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#2ecc71" }]}
          onPress={onConfirm}
        >
          <Text style={styles.btnText}>GPS confirmed → Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },

  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
  },

  list: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },

  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  disabled: {
    backgroundColor: "#f2f2f2",
  },

  box: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  row: { flexDirection: "row", justifyContent: "space-between" },

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
    marginTop: 10,
  },

  btn: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "600" },
});
