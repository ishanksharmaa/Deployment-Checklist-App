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
    } catch {
      Alert.alert(
        "Error",
        "Failed to load progress. Please restart the app."
      );
    }
  };

  /* ---------- STEP NAV GUARD ---------- */
  const handleStepPress = (step) => {
    // deployment steps
    if (step.type === "deployment") {
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

    // retrieval steps
    if (step.type === "retrieval") {
      if (!allSitesDone) {
        Alert.alert(
          "Retrieval locked",
          "Complete deployment for all sites before retrieval."
        );
        return;
      }
      navigation.navigate(step.screen);
    }
  };

  /* ---------- FILTER STEPS ---------- */
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
      <Text style={styles.header}>
        Deployment Checklist App
      </Text>

      {/* ---------- DEPLOYMENT ---------- */}
      <Text style={styles.sectionTitle}>
        Deployment Flow
      </Text>

      <View style={styles.grid}>
        {deploymentSteps.map((step) => (
          <StepButton
            key={step.id}
            step={step}
            currentStep={currentStep}
            onPress={() => handleStepPress(step)}
          />
        ))}
      </View>

      {/* ---------- RETRIEVAL ---------- */}
      <Text
        style={[
          styles.sectionTitle,
          { marginTop: 30 },
        ]}
      >
        Retrieval Flow
      </Text>

      <View style={styles.grid}>
        {retrievalSteps.map((step) => (
          <StepButton
            key={step.id}
            step={step}
            currentStep={
              allSitesDone ? step.id : 0
            }
            onPress={() => handleStepPress(step)}
          />
        ))}
      </View>

      {/* ---------- SUMMARY ---------- */}
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
    </ScrollView>
  );
}

/* ---------- styles ---------- */

const getStyles = (colors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
      textAlign: "center",
      color: colors.text,
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
