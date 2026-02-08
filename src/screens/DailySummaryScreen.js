import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LightTheme, DarkTheme } from "../constants/theme";
import Header from "../components/Header";
import {
  getAllSites,
  isAllSitesCompleted,
} from "../storage/sitesStorage";

export default function DailySummaryScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [sites, setSites] = useState([]);
  const [allDone, setAllDone] = useState(false);

  /* ---------- LOAD SUMMARY ---------- */
  useFocusEffect(
    useCallback(() => {
      loadSummary();
    }, [])
  );

  const loadSummary = async () => {
    try {
      const allSites = await getAllSites();
      setSites(allSites);

      const done = await isAllSitesCompleted();
      setAllDone(done);
    } catch {
      Alert.alert("Error", "Failed to load daily summary");
    }
  };

  /* ---------- FINISH DAY ---------- */
  const onFinishDay = async () => {
    if (!allDone) {
      Alert.alert(
        "Deployment incomplete",
        "All sites must be completed before closing the day."
      );
      return;
    }

    try {
      await AsyncStorage.multiRemove(["currentSiteId"]);
      navigation.popToTop();
    } catch {
      Alert.alert("Error", "Failed to complete deployment day");
    }
  };

  const completedCount = sites.filter((s) => s.completed).length;
  const today = new Date().toLocaleDateString();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Daily Deployment Summary"
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* OVERALL SUMMARY */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.big, { color: colors.text }]}>
            {completedCount} / {sites.length}
          </Text>

          <Text style={[styles.sub, { color: colors.text }]}>
            Sites deployed today
          </Text>

          <Text style={[styles.date, { color: colors.text }]}>
            Date: {today}
          </Text>
        </View>

        {/* PER SITE STATUS */}
        <View style={styles.list}>
          {sites.map((site) => (
            <View
              key={site.id}
              style={[
                styles.siteRow,
                {
                  borderColor: colors.border,
                  backgroundColor: site.completed
                    ? "#2ecc7120"
                    : "transparent",
                },
              ]}
            >
              <Text style={{ color: colors.text }}>
                {site.id}
              </Text>
              <Text
                style={{
                  color: site.completed
                    ? "#2ecc71"
                    : "#e74c3c",
                  fontWeight: "600",
                }}
              >
                {site.completed ? "Complete" : "Incomplete"}
              </Text>
            </View>
          ))}
        </View>

        {/* FINISH BUTTON */}
        <TouchableOpacity
          disabled={!allDone}
          style={[
            styles.btn,
            {
              backgroundColor: allDone
                ? "#2ecc71"
                : colors.border,
              opacity: allDone ? 1 : 0.6,
            },
          ]}
          onPress={onFinishDay}
        >
          <Text style={styles.btnText}>
            Deployment day complete
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
    alignItems: "center",
    padding: 28,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },

  big: {
    fontSize: 42,
    fontWeight: "700",
  },

  sub: {
    marginTop: 6,
    fontSize: 14,
    opacity: 0.8,
  },

  date: {
    marginTop: 6,
    fontSize: 13,
    opacity: 0.7,
  },

  list: {
    marginTop: 10,
  },

  siteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },

  btn: {
    marginTop: 30,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
