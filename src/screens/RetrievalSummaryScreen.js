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
import {
  getSiteById,
  updateSite,
  markRetrievalCompleted,
} from "../storage/sitesStorage";

export default function RetrievalSummaryScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [siteId, setSiteId] = useState("");
  const [site, setSite] = useState(null);
  const [timeRetrieved, setTimeRetrieved] = useState("");

  /* ---------- LOAD SITE ---------- */
  useEffect(() => {
    loadSite();
  }, []);

  const loadSite = async () => {
    const id = await AsyncStorage.getItem("currentRetrievalSiteId");
    if (!id) {
      Alert.alert("Error", "No retrieval site found.");
      navigation.navigate("Home");
      return;
    }

    const fullSite = await getSiteById(id);
    if (!fullSite) {
      Alert.alert("Error", "Failed to load site data.");
      navigation.navigate("Home");
      return;
    }

    setSiteId(id);
    setSite(fullSite);
    setTimeRetrieved(new Date().toLocaleString());
  };

  /* ---------- FINISH RETRIEVAL ---------- */
  const onComplete = async () => {
    try {
      await updateSite(siteId, {
        retrieval: {
          ...site.retrieval,
          timeRetrieved,
        },
      });

      await markRetrievalCompleted(siteId);

      await AsyncStorage.removeItem("currentRetrievalSiteId");

      navigation.navigate("Home");
    } catch {
      Alert.alert("Error", "Failed to complete retrieval.");
    }
  };

  if (!site) return null;

  const r = site.retrieval || {};
  const d = r.deviceStatus || {};
  const g = r.groundTruthUpdate || {};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title={`Retrieval Summary (${siteId})`}
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* BASIC INFO */}
        <Section title="Basic Info" colors={colors}>
          <Row label="Site ID" value={siteId} />
          <Row label="Arrival Time" value={r.arrival?.time} />
          <Row label="Time Retrieved" value={timeRetrieved} />
        </Section>

        {/* DEVICE STATUS */}
        <Section title="Device Status" colors={colors}>
          <Row label="Battery Level" value={d.battery} />
          <Row label="Condition" value={d.condition} />
          <Row
            label="SD Card Removed"
            value={d.sdRemoved ? "Yes" : "No"}
          />
          <Row label="Notes" value={d.note} />
        </Section>

        {/* GROUND TRUTH UPDATE */}
        <Section title="Ground Truth Update" colors={colors}>
          <Row
            label="Vegetation Changed"
            value={g.vegetationChanged ? "Yes" : "No"}
          />
          <Row label="Bird Activity" value={g.birdActivity} />
          <Row label="Noise Level" value={g.noiseLevel} />
          <Row label="Notes" value={g.notes} />
          <Row label="Photo Attached" value={g.photo ? "Yes" : "No"} />
        </Section>

        {/* COMPLETE */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#2ecc71" }]}
          onPress={onComplete}
        >
          <Text style={styles.btnText}>
            Complete this retrieval → Next site
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- SMALL UI ---------- */

function Section({ title, children, colors }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{String(value)}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },

  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },

  sectionTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  rowLabel: {
    fontSize: 13,
    opacity: 0.7,
  },

  rowValue: {
    fontSize: 13,
    fontWeight: "500",
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
