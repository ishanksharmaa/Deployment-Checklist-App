import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";
import { updateSite } from "../storage/sitesStorage";
import Header from "../components/Header";

export default function DeviceSetupScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [currentSiteId, setCurrentSiteId] = useState("");

  const [deviceId, setDeviceId] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [batteryOk, setBatteryOk] = useState(false);
  const [sdOk, setSdOk] = useState(false);
  const [duration, setDuration] = useState("");

  /* ---------- LOAD CURRENT SITE ---------- */
  useEffect(() => {
    loadSite();
  }, []);

  const loadSite = async () => {
    const site = await AsyncStorage.getItem("currentSiteId");
    if (!site) {
      Alert.alert("Error", "No site selected.");
      navigation.navigate("Home");
      return;
    }
    setCurrentSiteId(site);
  };

  /* ---------- COMPLETE ---------- */
  const onComplete = async () => {
    if (!deviceId.trim()) {
      Alert.alert("Missing info", "Please enter Device ID / Serial.");
      return;
    }
    if (!customMode || !batteryOk || !sdOk) {
      Alert.alert(
        "Checklist incomplete",
        "Complete all device configuration checks."
      );
      return;
    }
    if (!duration) {
      Alert.alert("Missing info", "Select expected recording duration.");
      return;
    }

    // save device setup into site object
    await updateSite(currentSiteId, {
      deviceSetup: {
        deviceId,
        customMode,
        batteriesOk: batteryOk, // ✅ correct key
        sdOk,
        duration,
      },
    });

    await setCurrentStep(4);
    navigation.navigate("Placement");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Device Setup"
        colors={colors}
        onBack={() => navigation.navigate("Home")}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          placeholder="Device ID / Serial"
          placeholderTextColor="#888"
          value={deviceId}
          onChangeText={setDeviceId}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
        />

        <CheckItem
          label="Device switched to CUSTOM mode (LED should be green)"
          checked={customMode}
          onPress={() => setCustomMode(!customMode)}
          colors={colors}
        />

        <CheckItem
          label="Batteries inserted correctly"
          checked={batteryOk}
          onPress={() => setBatteryOk(!batteryOk)}
          colors={colors}
        />

        <CheckItem
          label="Formatted SD card installed"
          checked={sdOk}
          onPress={() => setSdOk(!sdOk)}
          colors={colors}
        />

        <Text style={[styles.subTitle, { color: colors.text }]}>
          Expected Recording Duration
        </Text>

        <View style={styles.row}>
          <DurationBtn
            label="1 day"
            active={duration === "1"}
            onPress={() => setDuration("1")}
          />
          <DurationBtn
            label="3 days"
            active={duration === "3"}
            onPress={() => setDuration("3")}
          />
          <DurationBtn
            label="5 days"
            active={duration === "5"}
            onPress={() => setDuration("5")}
          />
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text, fontSize: 13 }}>
            • No LED flash → Check battery orientation{"\n"}
            • Red LED flashing → Reinsert SD card firmly{"\n"}
            • Still issues → Report to Darukaa.Earth
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#2ecc71" }]}
          onPress={onComplete}
        >
          <Text style={styles.btnText}>
            Device ready → Proceed to Placement
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- components ---------- */

function CheckItem({ label, checked, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.checkItem,
        { borderColor: checked ? "#2ecc71" : colors.border },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.circle,
          { backgroundColor: checked ? "#2ecc71" : "transparent" },
        ]}
      >
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>

      <Text style={[styles.checkText, { color: colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function DurationBtn({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.durationBtn,
        { backgroundColor: active ? "#2ecc71" : "#ccc" },
      ]}
      onPress={onPress}
    >
      <Text style={{ color: active ? "#fff" : "#000" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 10,
  },

  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#2ecc71",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  tick: { color: "#fff", fontWeight: "600" },

  checkText: { flex: 1, fontSize: 14 },

  subTitle: { marginTop: 16, marginBottom: 8, fontSize: 14 },

  row: { flexDirection: "row", justifyContent: "space-between" },

  durationBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },

  infoBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },

  btn: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "600" },
});
