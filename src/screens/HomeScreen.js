import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LightTheme, DarkTheme } from "../constants/theme";
import { getCurrentStep, resetProgress } from "../storage/progressStorage";
import {
  isAllSitesCompleted,
  resetAllSites,
} from "../storage/sitesStorage";
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

  /* ---------- LOAD STATE ---------- */
  const loadData = async () => {
    try {
      const step = await getCurrentStep();
      setCurrentStep(step || 1);

      const done = await isAllSitesCompleted();
      setAllSitesDone(done);
    } catch {
      Alert.alert(
        "Error",
        "Failed to load progress. Restart app."
      );
    }
  };

  /* ---------- CLEAR ALL DATA ---------- */
  const handleClearAll = () => {
    Alert.alert(
      "Clear all data?",
      "This will permanently delete all deployment and retrieval data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: confirmClearAll,
        },
      ]
    );
  };

  const confirmClearAll = async () => {
    try {
      await AsyncStorage.clear();
      await resetAllSites();
      await resetProgress();

      Alert.alert(
        "Cleared",
        "All app data has been reset."
      );

      navigation.replace("Home");
    } catch {
      Alert.alert(
        "Error",
        "Failed to clear storage."
      );
    }
  };

  /* ---------- STEP HANDLER ---------- */
  const handleStepPress = (step) => {
    if (step.type === "deployment") {
      if (allSitesDone) return;

      if (step.id > currentStep) {
        Alert.alert(
          "Step locked",
          "Complete previous steps first."
        );
        return;
      }
      navigation.navigate(step.screen);
      return;
    }

    if (step.type === "retrieval") {
      if (!allSitesDone) {
        Alert.alert(
          "Retrieval locked",
          "Complete deployment for all sites first."
        );
        return;
      }
      navigation.navigate(step.screen);
    }
  };

  const deploymentSteps = STEPS.filter(
    (s) => s.type === "deployment"
  );

  const retrievalSteps = STEPS.filter(
    (s) => s.type === "retrieval"
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>
          Deployment Checklist App
        </Text>
      </View>

      {/* DEPLOYMENT */}
      {!allSitesDone && (
        <>
          {/* <Text style={styles.sectionTitle}>
            Deployment Flow
          </Text> */}

          <View style={styles.grid}>
            {deploymentSteps.map((step) => (
              <StepButton
                key={step.id}
                step={step}
                currentStep={currentStep}
                onPress={() =>
                  handleStepPress(step)
                }
              />
            ))}
          </View>
        </>
      )}

      {/* RETRIEVAL */}
      {allSitesDone && (
        <>
          <Text style={styles.sectionTitle}>
            Retrieval Flow
          </Text>

          <View style={styles.grid}>
            {retrievalSteps.map((step) => (
              <StepButton
                key={step.id}
                step={step}
                currentStep={step.id}
                onPress={() =>
                  handleStepPress(step)
                }
              />
            ))}
          </View>
        </>
      )}

      {/* SUMMARY */}
      <TouchableOpacity
        style={styles.summaryBtn}
        onPress={() =>
          navigation.navigate("SiteSummary")
        }
      >
        <Text style={styles.summaryText}>
          View Site Summary
        </Text>
      </TouchableOpacity>

      {allSitesDone && (
        <TouchableOpacity
          style={[
            styles.summaryBtn,
            { marginTop: 12 },
          ]}
          onPress={() =>
            navigation.navigate("DailySummary")
          }
        >
          <Text style={styles.summaryText}>
            View Daily Summary
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={handleClearAll}
        style={styles.clearBtn}
      >
        <Text style={styles.clearText}>Clear all data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- STYLES ---------- */

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 40,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 25,
      marginTop: 30,
    },
    header: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },
    clearBtn: {
      paddingHorizontal: 0,
      paddingVertical: 12,
      borderRadius: 6,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      borderColor: "#DC143C",
      marginTop: 14,
    },
    clearText: {
      color: "#DC143C",
      fontWeight: "600",
      fontSize: 14,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 12,
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
