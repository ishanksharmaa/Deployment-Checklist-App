import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { LightTheme, DarkTheme } from "../constants/theme";
import { getCurrentStep } from "../storage/progressStorage";
import { isAllSitesCompleted } from "../storage/sitesStorage";
import StepButton from "../components/StepButton";
import { STEPS } from "../constants/steps";

export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;
  const styles = getStyles(colors);

  const [currentStep, setCurrentStep] = useState(1);
  const [allSitesDone, setAllSitesDone] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  /* ---------- LOAD DATA ---------- */
  const loadData = async () => {
    try {
      const step = await getCurrentStep();
      setCurrentStep(step || 1);

      const done = await isAllSitesCompleted();
      setAllSitesDone(done);
    } catch (err) {
      Alert.alert(
        "Error",
        "Failed to load app progress. Please restart the app."
      );
    }
  };

  /* ---------- STEP NAV GUARD ---------- */
  const handleStepPress = (step) => {
    if (step.id > currentStep) {
      Alert.alert(
        "Step locked",
        "Complete previous steps before proceeding."
      );
      return;
    }
    navigation.navigate(step.screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Deployment Checklist App</Text>

      {/* STEP CARDS */}
      <View style={styles.grid}>
        {STEPS.map((step) => (
          <StepButton
            key={step.id}
            step={step}
            currentStep={currentStep}
            onPress={() => handleStepPress(step)}
          />
        ))}
      </View>

      {/* VIEW SITE SUMMARY (always visible) */}
      <TouchableOpacity
        style={styles.summaryBtn}
        onPress={() => navigation.navigate("SiteSummary")}
      >
        <Text style={styles.summaryText}>View Site Summary</Text>
      </TouchableOpacity>

      {/* VIEW DAILY SUMMARY (only when all sites done) */}
      {allSitesDone && (
        <TouchableOpacity
          style={[styles.summaryBtn, { marginTop: 12 }]}
          onPress={() => navigation.navigate("DailySummary")}
        >
          <Text style={styles.summaryText}>View Daily Summary</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ---------- styles ---------- */

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 50,
      backgroundColor: colors.background,
    },
    header: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 25,
      textAlign: "center",
      color: colors.text,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
    },
    summaryBtn: {
      marginTop: 30,
      paddingVertical: 14,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    summaryText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
  });
