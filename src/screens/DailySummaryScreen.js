import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightTheme, DarkTheme } from "../constants/theme";

export default function DailySummaryScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    loadCount();
  }, []);

  const loadCount = async () => {
    // simple count based on how many times site was completed today
    const raw = await AsyncStorage.getItem("dailyCompletedCount");
    setCompletedCount(raw ? Number(raw) : 0);
  };

  const onFinishDay = async () => {
    // reset daily counter
    await AsyncStorage.setItem("dailyCompletedCount", "0");
    navigation.popToTop();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Daily Summary
      </Text>

      <View style={styles.card}>
        <Text style={[styles.big, { color: colors.text }]}>
          {completedCount}
        </Text>
        <Text style={[styles.sub, { color: colors.text }]}>
          Sites completed today
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#2ecc71" }]}
        onPress={onFinishDay}
      >
        <Text style={styles.btnText}>Deployment day complete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  card: {
    alignItems: "center",
    padding: 24,
    borderRadius: 10,
    backgroundColor: "#00000010",
  },
  big: { fontSize: 42, fontWeight: "700" },
  sub: { marginTop: 6, fontSize: 14, opacity: 0.8 },
  btn: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
