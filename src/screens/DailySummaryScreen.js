import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";

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

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const sites = await getAllSites();
    const completed = sites.filter((s) => s.completed);

    setCompletedCount(completed.length);
    setTotalSites(sites.length);
  };

  const onFinishDay = async () => {
    const allDone = await isAllSitesCompleted();

    if (!allDone) {
      Alert.alert(
        "Deployment incomplete",
        "All sites must be successfully deployed before closing the deployment day."
      );
      return;
    }

    // Clear temporary session data (NOT site data)
    await AsyncStorage.multiRemove([
      "currentSiteId",
    ]);

    // Go back to start (Home)
    navigation.popToTop();
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
          style={[styles.btn, { backgroundColor: "#2ecc71" }]}
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
