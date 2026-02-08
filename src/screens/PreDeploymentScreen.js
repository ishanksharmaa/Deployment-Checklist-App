import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  Alert,
  ScrollView,
} from "react-native";
import { LightTheme, DarkTheme } from "../constants/theme";
import { setCurrentStep } from "../storage/progressStorage";
import Header from "../components/Header";

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

  const [teamReady, setTeamReady] = useState(false);
  const [vehicleReady, setVehicleReady] = useState(false);
  const [travelTime, setTravelTime] = useState("");

  const toggleCheck = (key) => {
    setChecks((p) => ({ ...p, [key]: !p[key] }));
  };

  const allMandatoryDone = Object.values(checks).every((v) => v);

  const onComplete = async () => {
    if (!allMandatoryDone) {
      Alert.alert(
        "Checklist incomplete",
        "All mandatory checks must be completed."
      );
      return;
    }

    await setCurrentStep(2);
    navigation.navigate("SiteArrival");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Pre-Deployment Checklist (only once)"
        colors={colors}
        onBack={() => navigation.navigate("Home")}
      />


      <ScrollView
        // style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        <Text style={[styles.subtitle, { color: colors.text }]}>
          BEFORE LEAVING BASE CAMP
        </Text>

        <ChecklistItem
          label="All devices configured with correct settings (provided by Darukaa.Earth)"
          checked={checks.devicesConfigured}
          onPress={() => toggleCheck("devicesConfigured")}
          colors={colors}
        />

        <ChecklistItem
          label="Fresh AA batteries inserted into each device (3 batteries per device)"
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
          label="GPS coordinates downloaded for all 7 sites today"
          checked={checks.gpsDownloaded}
          onPress={() => toggleCheck("gpsDownloaded")}
          colors={colors}
        />

        <ChecklistItem
          label="Smartphones charged (GPS + camera ready)"
          checked={checks.phoneCharged}
          onPress={() => toggleCheck("phoneCharged")}
          colors={colors}
        />

        <Text style={[styles.section, { color: colors.text }]}>
          Optional: Team & Logistics Check
        </Text>

        <ChecklistItem
          label="2-3 field staff ready"
          checked={teamReady}
          onPress={() => setTeamReady(!teamReady)}
          colors={colors}
        />

        <ChecklistItem
          label="Vehicle prepared for site access"
          checked={vehicleReady}
          onPress={() => setVehicleReady(!vehicleReady)}
          colors={colors}
        />

        <TextInput
          placeholder="Time estimate for cluster travel (minutes)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={travelTime}
          onChangeText={setTravelTime}
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
        />

        <TouchableOpacity
          style={[
            styles.completeButton,
            {
              backgroundColor: allMandatoryDone ? "#2ecc71" : colors.border,
              opacity: allMandatoryDone ? 1 : 0.6,
            },
          ]}
          onPress={onComplete}
        >
          <Text style={styles.completeText}>
            All checked! → Proceed to Site Visits
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function ChecklistItem({ label, checked, onPress, colors }) {
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
          styles.tickCircle,
          { backgroundColor: checked ? "#2ecc71" : "transparent" },
        ]}
      >
        {checked && <Text style={styles.tick}>✓</Text>}
      </View>

      <Text style={[styles.itemText, { color: colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 18,
    opacity: 0.8,
  },
  section: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1.6,
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  completeButton: {
    marginTop: 24,
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
