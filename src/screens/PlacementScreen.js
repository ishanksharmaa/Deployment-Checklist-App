import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";

export default function PlacementScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [checks, setChecks] = useState({
    heightOk: false,
    micOut: false,
    tiltDown: false,
    awayFromTrail: false,
    awayFromWater: false,
    secureAttach: false,
    waterproof: false,
  });

  const toggle = (key) =>
    setChecks((p) => ({ ...p, [key]: !p[key] }));

  const allDone = Object.values(checks).every(Boolean);

  const onComplete = async () => {
    if (!allDone) {
      Alert.alert(
        "Checklist incomplete",
        "Please confirm all placement checks."
      );
      return;
    }
    await setCurrentStep(5);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Placement Checklist
      </Text>

      <CheckItem
        label="Recorder placed 1.5–2 m above ground"
        checked={checks.heightOk}
        onPress={() => toggle("heightOk")}
        colors={colors}
      />
      <CheckItem
        label="Microphone facing outward"
        checked={checks.micOut}
        onPress={() => toggle("micOut")}
        colors={colors}
      />
      <CheckItem
        label="Slight downward tilt for rain protection"
        checked={checks.tiltDown}
        onPress={() => toggle("tiltDown")}
        colors={colors}
      />
      <CheckItem
        label="At least 5 m away from trails"
        checked={checks.awayFromTrail}
        onPress={() => toggle("awayFromTrail")}
        colors={colors}
      />
      <CheckItem
        label="Away from water splashing"
        checked={checks.awayFromWater}
        onPress={() => toggle("awayFromWater")}
        colors={colors}
      />
      <CheckItem
        label="Securely attached (cable ties / velcro)"
        checked={checks.secureAttach}
        onPress={() => toggle("secureAttach")}
        colors={colors}
      />
      <CheckItem
        label="Placed in waterproof cover"
        checked={checks.waterproof}
        onPress={() => toggle("waterproof")}
        colors={colors}
      />

      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: allDone ? "#2ecc71" : colors.border },
        ]}
        onPress={onComplete}
      >
        <Text style={styles.btnText}>Placement complete → Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

function CheckItem({ label, checked, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.item,
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
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  item: {
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
  text: { flex: 1, fontSize: 14 },
  btn: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
