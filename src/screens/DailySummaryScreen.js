import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { LightTheme, DarkTheme } from "../constants/theme";
import Header from "../components/Header";
import {
  getAllSites,
  isAllSitesCompleted,
} from "../storage/sitesStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DailySummaryScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [completedCount, setCompletedCount] = useState(0);
  const [totalSites, setTotalSites] = useState(0);
  const [allDone, setAllDone] = useState(false);

  /* ---------- LOAD SUMMARY ON FOCUS ---------- */
  useFocusEffect(
    useCallback(() => {
      loadSummary();
    }, [])
  );

  const loadSummary = async () => {
    try {
      const sites = await getAllSites();
      const completed = sites.filter((s) => s.completed);

      setCompletedCount(completed.length);
      setTotalSites(sites.length);

      const done = await isAllSitesCompleted();
      setAllDone(done);
    } catch (err) {
      Alert.alert("Error", "Failed to load daily summary.");
    }
  };

  /* ---------- FINISH DAY ---------- */
  const onFinishDay = async () => {
    if (!allDone) {
      Alert.alert(
        "Deployment incomplete",
        "All sites must be successfully deployed before closing the deployment day."
      );
      return;
    }

    try {
      // Clear temporary session data (NOT site data)
      await AsyncStorage.multiRemove(["currentSiteId"]);

      // Reset navigation to Home
      navigation.popToTop();
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to close deployment day."
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Daily Summary"
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.container}>
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
            {completedCount} / {totalSites}
          </Text>

          <Text style={[styles.sub, { color: colors.text }]}>
            Sites successfully deployed today
          </Text>
        </View>

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
      </View>
    </View>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    alignItems: "center",
    padding: 28,
    borderRadius: 12,
    borderWidth: 1,
  },
  big: {
    fontSize: 42,
    fontWeight: "700",
  },
  sub: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
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
