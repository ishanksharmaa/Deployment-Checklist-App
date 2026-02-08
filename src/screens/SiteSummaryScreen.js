import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SiteSummaryScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

const onFinishSite = async () => {
  // update daily completed count
  const raw = await AsyncStorage.getItem("dailyCompletedCount");
  const count = raw ? Number(raw) : 0;
  await AsyncStorage.setItem(
    "dailyCompletedCount",
    String(count + 1)
  );

  // reset flow for next site
  await setCurrentStep(2);

  // go to daily summary
  navigation.replace("DailySummary");
};


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Site Summary
      </Text>

      <View style={styles.card}>
        <Row label="Pre-Deployment" />
        <Row label="Site Arrival" />
        <Row label="Device Setup" />
        <Row label="Placement" />
        <Row label="Documentation" />
        <Row label="Ground Truth" />
        <Row label="Photos" />
      </View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#2ecc71" }]}
        onPress={onFinishSite}
      >
        <Text style={styles.btnText}>Site completed → Next site</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowText}>{label}</Text>
      <Text style={styles.ok}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  card: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#00000010",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowText: { fontSize: 14 },
  ok: { color: "#2ecc71", fontWeight: "600" },
  btn: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
