import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { DarkTheme, LightTheme } from "../constants/theme";

export default function StepButton({ step, currentStep, onPress }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const isCompleted = step.id < currentStep;
  const isActive = step.id === currentStep;

  const bgColor = isCompleted
    ? "#2ecc71"
    : isActive
    ? colors.activeStepBtn
    : colors.inActiveStepBtn;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: bgColor,
          opacity: isActive || isCompleted ? 1 : scheme === "dark" ? 0.5 : 0.3,
        },
      ]}
      disabled={!isActive}
      onPress={onPress}
    >
      <View style={styles.inner}>
        <Text style={[styles.number, { color: isCompleted ? "#fff" : colors.text }]}>
          {step.id}
        </Text>

        <Text
          style={[
            styles.title,
            { color: isCompleted ? "#fff" : colors.text },
          ]}
          numberOfLines={3}
        >
          {step.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 160,
    borderRadius: 16,
    marginBottom: 16,
    marginRight: 0,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  inner: {
    alignItems: "center",
    paddingHorizontal: 6,
  },
  number: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
