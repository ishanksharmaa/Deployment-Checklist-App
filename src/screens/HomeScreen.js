import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { LightTheme, DarkTheme } from "../constants/theme";
import { getCurrentStep } from "../storage/progressStorage";
import StepButton from "../components/StepButton";
import { STEPS } from "../constants/steps";

export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme();
  const [theme, setTheme] = useState("light");
  const colors = theme === "dark" ? DarkTheme : LightTheme;
  const styles = getStyles(colors);
  const [currentStep, setCurrentStep] = useState(1);

  //   useEffect(() => {
  //     loadStep();
  //   }, []);

  useFocusEffect(
    useCallback(() => {
      loadStep();
    }, [])
  );


  const loadStep = async () => {
    const step = await getCurrentStep();
    setCurrentStep(step);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}
        onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        Deployment Checklist
      </Text>

      {STEPS.map((step) => (
        <StepButton
          key={step.id}
          step={step}
          currentStep={currentStep}
          onPress={() => navigation.navigate(step.screen)}
        />
      ))}
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 52, backgroundColor: colors.background },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: colors.text,
  },
});
