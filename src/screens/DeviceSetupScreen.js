import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";

export default function DeviceSetupScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [deviceId, setDeviceId] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [batteryOk, setBatteryOk] = useState(false);
  const [sdOk, setSdOk] = useState(false);
  const [duration, setDuration] = useState("");

  const onComplete = async () => {
    if (!deviceId) {
      Alert.alert("Missing info", "Please enter Device ID.");
      return;
    }
    if (!customMode || !batteryOk || !sdOk) {
      Alert.alert("Checklist incomplete", "Please confirm all device checks.");
      return;
    }
    if (!duration) {
      Alert.alert("Missing info", "Please select recording duration.");
      return;
    }

    await setCurrentStep(4);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Device Setup
      </Text>

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
        label="Device switched to CUSTOM mode (LED green)"
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
        Recording duration
      </Text>

      <View style={styles.row}>
        <DurationBtn
          label="1 Day"
          active={duration === "1"}
          onPress={() => setDuration("1")}
        />
        <DurationBtn
          label="3 Days"
          active={duration === "3"}
          onPress={() => setDuration("3")}
        />
        <DurationBtn
          label="5 Days"
          active={duration === "5"}
          onPress={() => setDuration("5")}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={{ color: colors.text, fontSize: 13 }}>
          • No LED flash → check batteries{"\n"}
          • Red LED → reinsert SD card{"\n"}
          • Still issues → report to coordinator
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#2ecc71" }]}
        onPress={onComplete}
      >
        <Text style={styles.btnText}>Device ready → Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

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
        { backgroundColor: active ? "#2ecc71" : "#ddd" },
      ]}
      onPress={onPress}
    >
      <Text style={{ color: active ? "#fff" : "#000" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  subTitle: { marginTop: 16, marginBottom: 8, fontSize: 14 },
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
    backgroundColor: "#00000010",
  },
  btn: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
