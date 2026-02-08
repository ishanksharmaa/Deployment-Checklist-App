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

export default function PreDeploymentScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [checks, setChecks] = useState({
    devicesConfigured: false,
    batteriesInserted: false,
    sdCardsFormatted: false,
    deviceLabeled: false,
    gpsDownloaded: false,
    phoneCharged: false,
  });

  const toggleCheck = (key) => {
    setChecks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allCompleted = Object.values(checks).every((v) => v === true);

  const onComplete = async () => {
    if (!allCompleted) {
      Alert.alert(
        "Checklist incomplete",
        "Please complete all items before proceeding."
      );
      return;
    }

    await setCurrentStep(2);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Pre-Deployment Checklist
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]}>
        Complete all checks before leaving base camp.
      </Text>

      <ChecklistItem
        label="All devices configured with correct settings"
        checked={checks.devicesConfigured}
        onPress={() => toggleCheck("devicesConfigured")}
        colors={colors}
      />

      <ChecklistItem
        label="Fresh AA batteries inserted (3 per device)"
        checked={checks.batteriesInserted}
        onPress={() => toggleCheck("batteriesInserted")}
        colors={colors}
      />

      <ChecklistItem
        label="Formatted SD cards installed (32GB recommended)"
        checked={checks.sdCardsFormatted}
        onPress={() => toggleCheck("sdCardsFormatted")}
        colors={colors}
      />

      <ChecklistItem
        label="Device labeled with Site ID (C#-S#)"
        checked={checks.deviceLabeled}
        onPress={() => toggleCheck("deviceLabeled")}
        colors={colors}
      />

      <ChecklistItem
        label="GPS coordinates downloaded for all sites"
        checked={checks.gpsDownloaded}
        onPress={() => toggleCheck("gpsDownloaded")}
        colors={colors}
      />

      <ChecklistItem
        label="Smartphone charged (GPS + camera ready)"
        checked={checks.phoneCharged}
        onPress={() => toggleCheck("phoneCharged")}
        colors={colors}
      />

      <TouchableOpacity
        style={[
          styles.completeButton,
          {
            backgroundColor: allCompleted ? "#2ecc71" : colors.border,
            opacity: allCompleted ? 1 : 0.6,
          },
        ]}
        onPress={onComplete}
      >
        <Text style={styles.completeText}>All checked → Proceed</Text>
      </TouchableOpacity>
    </View>
  );
}

function ChecklistItem({ label, checked, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
        //   borderColor: checked ? "#2ecc71" : colors.border,
          borderColor: checked ? colors.border : colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.tickCircle,
          { backgroundColor: checked ? "#2ecc71" : "transparent" },
        ]}
      >
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>

      {/* <Text style={[styles.itemText, { color: checked ? "#2ecc71" : colors.text }]}> */}
      <Text style={[styles.itemText, { color: colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.8,
  },
  item: {
    flexDirection: "column",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1.8,
    marginBottom: 10,
  },
  tickCircle: {
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
    fontSize: 14,
    fontWeight: "600",
  },
  itemText: {
    fontSize: 14,
    flex: 1,
  },
  completeButton: {
    marginTop: 25,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  completeText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
