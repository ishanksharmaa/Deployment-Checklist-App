import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function StepButton({ step, currentStep, onPress }) {
  const isCompleted = step.id < currentStep;
  const isActive = step.id === currentStep;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isCompleted ? "#2ecc71" : isActive ? "#e0e0e0" : "#cccccc",
          opacity: isActive || isCompleted ? 1 : 0.5,
        },
      ]}
      disabled={!isActive}
      onPress={onPress}
    >
      <Text style={{ color: isCompleted ? "#fff" : "#000" }}>
        {step.id}. {step.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
});
