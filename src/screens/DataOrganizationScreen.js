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

import { LightTheme, DarkTheme } from "../constants/theme";
import Header from "../components/Header";
import { getAllSites } from "../storage/sitesStorage";

export default function DataOrganizationScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [sites, setSites] = useState([]);
  const [allRetrieved, setAllRetrieved] = useState(false);

  /* ---------- LOAD SITES ---------- */
  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const data = await getAllSites();
      setSites(data);

      const retrieved = data.every(
        (s) => s.retrieval && s.retrieval.completed
      );
      setAllRetrieved(retrieved);
    } catch {
      Alert.alert("Error", "Failed to load sites data.");
    }
  };

  /* ---------- FINISH ---------- */
  const onReady = () => {
    if (!allRetrieved) {
      Alert.alert(
        "Retrieval pending",
        "All sites must be retrieved before organizing data."
      );
      return;
    }

    Alert.alert(
      "Ready for upload",
      "All data is organized and ready for upload."
    );

    // Next phase (upload workflow – future)
    navigation.popToTop();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Data Organization"
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* INFO */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            File organization checklist
          </Text>

          <Text style={[styles.text, { color: colors.text }]}>
            Folder format:{"\n"}
            <Text style={styles.bold}>
              YYYYMMDD_C#_S#
            </Text>
          </Text>

          <Text style={[styles.text, { color: colors.text }]}>
            Example:{"\n"}
            <Text style={styles.bold}>
              20251215_C1_S3
            </Text>
          </Text>
        </View>

        {/* SITE LIST */}
        {sites.map((site) => {
          const done = site.retrieval?.completed;

          return (
            <View
              key={site.id}
              style={[
                styles.siteRow,
                {
                  backgroundColor: done
                    ? "#2ecc71"
                    : colors.card,
                },
              ]}
            >
              <Text
                style={{
                  color: done ? "#fff" : colors.text,
                  fontWeight: "600",
                }}
              >
                {site.id}
              </Text>

              <Text
                style={{
                  color: done ? "#fff" : "#999",
                }}
              >
                {done ? "Retrieved ✓" : "Pending"}
              </Text>
            </View>
          );
        })}

        {/* FINAL BUTTON */}
        <TouchableOpacity
          disabled={!allRetrieved}
          style={[
            styles.btn,
            {
              backgroundColor: allRetrieved
                ? "#2ecc71"
                : colors.border,
              opacity: allRetrieved ? 1 : 0.6,
            },
          ]}
          onPress={onReady}
        >
          <Text style={styles.btnText}>
            Files organized → Ready to upload
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

  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  text: {
    fontSize: 14,
    marginBottom: 8,
  },

  bold: {
    fontWeight: "700",
  },

  siteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
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
