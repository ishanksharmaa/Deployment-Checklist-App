import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LightTheme, DarkTheme } from "../constants/theme";
import Header from "../components/Header";
import { getSiteById, updateSite } from "../storage/sitesStorage";
import { setCurrentStep } from "../storage/progressStorage";

export default function RecorderRetrievalScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [siteId, setSiteId] = useState("");
  const [site, setSite] = useState(null);

  /* device status */
  const [battery, setBattery] = useState("");
  const [condition, setCondition] = useState("");
  const [sdRemoved, setSdRemoved] = useState(false);
  const [note, setNote] = useState("");

  const [timeRetrieved, setTimeRetrieved] = useState("");

  /* ---------- LOAD SITE ---------- */
  useEffect(() => {
    loadSite();
    setTimeRetrieved(new Date().toLocaleString());
  }, []);

  const loadSite = async () => {
    try {
      const id = await AsyncStorage.getItem(
        "currentRetrievalSiteId"
      );

      if (!id) {
        Alert.alert("Error", "No retrieval site selected.");
        navigation.navigate("Home");
        return;
      }

      const data = await getSiteById(id);
      if (!data) {
        Alert.alert("Error", "Site not found.");
        navigation.navigate("Home");
        return;
      }

      setSiteId(id);
      setSite(data);
    } catch {
      Alert.alert("Error", "Failed to load site.");
    }
  };

  /* ---------- VALIDATION ---------- */
  const canProceed =
    battery &&
    condition &&
    sdRemoved !== false; // must confirm SD removed

  /* ---------- SAVE ---------- */
  const onConfirm = async () => {
    if (!canProceed) {
      Alert.alert(
        "Incomplete",
        "Please complete all required checks."
      );
      return;
    }

    try {
      await updateSite(siteId, {
        retrieval: {
          arrival: site.retrieval?.arrival || {},
          deviceStatus: {
            battery,
            condition,
            sdRemoved,
            note,
          },
          timeRetrieved,
          completed: false,
        },
      });

      await setCurrentStep(12);
      navigation.navigate("RetrievalGroundTruthUpdate");
    } catch {
      Alert.alert(
        "Error",
        "Failed to save retrieval data."
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title={`Recorder Retrieval (${siteId})`}
        colors={colors}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* INFO */}
        <View
          style={[
            styles.box,
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={{ color: colors.text }}>
            Switch device OFF before handling.
          </Text>
          <Text style={{ color: colors.text }}>
            Remove SD card carefully and label it.
          </Text>
        </View>

        {/* BATTERY */}
        <Text style={[styles.label, { color: colors.text }]}>
          Battery status
        </Text>
        {["Full", "Moderate", "Low", "Depleted"].map(
          (v) => (
            <Option
              key={v}
              value={v}
              selected={battery}
              set={setBattery}
              colors={colors}
            />
          )
        )}

        {/* CONDITION */}
        <Text style={[styles.label, { color: colors.text }]}>
          Device condition
        </Text>
        {["Dry", "Wet", "Damaged", "Missing"].map(
          (v) => (
            <Option
              key={v}
              value={v}
              selected={condition}
              set={setCondition}
              colors={colors}
            />
          )
        )}

        {/* SD CARD */}
        <Text style={[styles.label, { color: colors.text }]}>
          SD card removed & labeled?
        </Text>

        <View style={styles.row}>
          <Toggle
            label="Yes"
            active={sdRemoved === true}
            onPress={() => setSdRemoved(true)}
            colors={colors}
          />
          <Toggle
            label="No"
            active={sdRemoved === false}
            onPress={() => setSdRemoved(false)}
            colors={colors}
          />
        </View>

        {/* NOTE */}
        <TextInput
          placeholder="Notes (damage, moisture, issues)"
          placeholderTextColor="#888"
          value={note}
          onChangeText={setNote}
          multiline
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {/* TIME */}
        <View
          style={[
            styles.box,
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={{ color: colors.text }}>
            Time retrieved
          </Text>
          <Text
            style={{
              color: colors.text,
              fontWeight: "600",
              marginTop: 4,
            }}
          >
            {timeRetrieved}
          </Text>
        </View>

        {/* CONFIRM */}
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: canProceed
                ? "#2ecc71"
                : colors.border,
              opacity: canProceed ? 1 : 0.6,
            },
          ]}
          disabled={!canProceed}
          onPress={onConfirm}
        >
          <Text style={styles.btnText}>
            Device retrieved → Proceed
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

function Option({ value, selected, set, colors }) {
  const active = value === selected;
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          borderColor: active
            ? "#2ecc71"
            : colors.border,
          backgroundColor: active
            ? "#2ecc71"
            : "transparent",
        },
      ]}
      onPress={() => set(value)}
    >
      <Text
        style={{
          color: active ? "#fff" : colors.text,
        }}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
}

function Toggle({ label, active, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[
        styles.toggle,
        {
          backgroundColor: active
            ? "#2ecc71"
            : colors.card,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={{
          color: active ? "#fff" : colors.text,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },

  label: {
    marginTop: 14,
    marginBottom: 6,
    fontWeight: "500",
  },

  option: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    marginBottom: 12,
  },

  toggle: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    minHeight: 70,
  },

  box: {
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
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
