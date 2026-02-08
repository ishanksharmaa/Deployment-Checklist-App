import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LightTheme, DarkTheme } from "../constants/theme";
import Header from "../components/Header";
import { getAllSites, updateSite } from "../storage/sitesStorage";
import { setCurrentStep } from "../storage/progressStorage";

export default function SiteRetrievalArrivalScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [sites, setSites] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [arrivalTime, setArrivalTime] = useState("");

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    loadSites();
    setArrivalTime(new Date().toLocaleString());
  }, []);

  const loadSites = async () => {
    try {
      const data = await getAllSites();
      setSites(data);
    } catch {
      Alert.alert("Error", "Failed to load sites");
    }
  };

  /* ---------- SELECT SITE ---------- */
  const onSelectSite = async (site) => {
    if (!site.completed) {
      Alert.alert(
        "Not deployed",
        "This site was not deployed yet."
      );
      return;
    }

    setSelectedSite(site);
    setOpen(false);

    await AsyncStorage.setItem(
      "currentRetrievalSiteId",
      site.id
    );
  };

  /* ---------- CONFIRM ARRIVAL ---------- */
  const onConfirm = async () => {
    if (!selectedSite) {
      Alert.alert("Missing", "Please select a site.");
      return;
    }

    try {
      await updateSite(selectedSite.id, {
        retrieval: {
          arrival: {
            time: arrivalTime,
            referenceCoords: selectedSite.arrival?.coords || null,
          },
        },
      });

      await setCurrentStep(11);
      navigation.navigate("RecorderRetrieval");
    } catch {
      Alert.alert(
        "Error",
        "Failed to save retrieval arrival."
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Site Retrieval Arrival"
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* SITE SELECT */}
        <Text style={[styles.label, { color: colors.text }]}>
          Select site to retrieve
        </Text>

        <TouchableOpacity
          style={[styles.dropdown, { borderColor: colors.border }]}
          onPress={() => setOpen(!open)}
        >
          <Text style={{ color: selectedSite ? colors.text : "#999" }}>
            {selectedSite ? selectedSite.id : "Choose site"}
          </Text>
        </TouchableOpacity>

        {open &&
          sites.map((site) => (
            <TouchableOpacity
              key={site.id}
              style={[
                styles.option,
                {
                  backgroundColor: site.completed
                    ? colors.card
                    : "#00000010",
                },
              ]}
              onPress={() => onSelectSite(site)}
            >
              <Text
                style={{
                  color: site.completed ? colors.text : "#999",
                }}
              >
                {site.id}
                {!site.completed && " (not deployed)"}
              </Text>
            </TouchableOpacity>
          ))}

        {/* DEPLOYMENT GPS (REFERENCE) */}
        {selectedSite?.arrival?.coords && (
          <View style={[styles.box, { backgroundColor: colors.card }]}>
            <Text style={styles.boxTitle}>Deployment GPS (reference)</Text>
            <Text style={styles.boxText}>
              Lat: {selectedSite.arrival.coords.lat}
            </Text>
            <Text style={styles.boxText}>
              Lng: {selectedSite.arrival.coords.lng}
            </Text>
          </View>
        )}

        {/* ARRIVAL TIME */}
        <View style={[styles.box, { backgroundColor: colors.card }]}>
          <Text style={styles.boxTitle}>Time of arrival</Text>
          <Text style={styles.timeText}>{arrivalTime}</Text>
        </View>

        {/* CONFIRM */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#2ecc71" }]}
          onPress={onConfirm}
        >
          <Text style={styles.btnText}>
            Arrived at site → Proceed
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  label: {
    marginBottom: 6,
    fontWeight: "500",
  },

  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },

  option: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },

  box: {
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
  },

  boxTitle: {
    fontWeight: "600",
    marginBottom: 6,
  },

  boxText: {
    fontSize: 13,
  },

  timeText: {
    marginTop: 4,
    fontWeight: "600",
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
