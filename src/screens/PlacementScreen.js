import React, { useState } from "react";
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
import { setCurrentStep } from "../storage/progressStorage";
import Header from "../components/Header";

export default function PlacementScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [checks, setChecks] = useState({
    heightOk: false,
    micOut: false,
    tiltDown: false,
    awayFromTrail: false,
    awayFromWater: false,
    awayFromRoad: false,
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
        "Confirm all placement rules before proceeding."
      );
      return;
    }

    await setCurrentStep(5);
    navigation.navigate("Documentation");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Placement Rules"
        colors={colors}
        onBack={() => navigation.navigate("Home")}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.section, { color: colors.text }]}>
          Height
        </Text>

        <CheckItem
          label="Recorder placed 1.5–2 meters above ground"
          checked={checks.heightOk}
          onPress={() => toggle("heightOk")}
          colors={colors}
        />

        <Text style={[styles.section, { color: colors.text }]}>
          Position
        </Text>

        <CheckItem
          label="Microphone facing outward (not into tree)"
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

        <Text style={[styles.section, { color: colors.text }]}>
          Location
        </Text>

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
          label="Away from roads / vehicles"
          checked={checks.awayFromRoad}
          onPress={() => toggle("awayFromRoad")}
          colors={colors}
        />

        <Text style={[styles.section, { color: colors.text }]}>
          Attachment
        </Text>

        <CheckItem
          label="Securely attached using cable ties or velcro (no branches)"
          checked={checks.secureAttach}
          onPress={() => toggle("secureAttach")}
          colors={colors}
        />

        <Text style={[styles.section, { color: colors.text }]}>
          Concealment
        </Text>

        <CheckItem
          label="Placed in waterproof cover"
          checked={checks.waterproof}
          onPress={() => toggle("waterproof")}
          colors={colors}
        />

        {/* Visual aid placeholder */}
        <View
          style={[
            styles.visualAid,
            { borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.text, fontSize: 13 }}>
            Visual aid: Correct placement diagram (1.5–2 m height,
            microphone outward, tilted, secured to tree trunk)
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.btn,
            { backgroundColor: allDone ? "#2ecc71" : colors.border },
          ]}
          onPress={onComplete}
        >
          <Text style={styles.btnText}>
            Placement complete → Proceed to Documentation
          </Text>
        </TouchableOpacity>
      </ScrollView>
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

      <Text style={[styles.text, { color: colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
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
  tick: {
    color: "#fff",
    fontWeight: "600",
  },
  text: {
    flex: 1,
    fontSize: 14,
  },
  visualAid: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    opacity: 0.7,
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
