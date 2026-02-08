import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Header({ title, onBack, colors }) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity style={styles.left} onPress={onBack}>
        <Text style={[styles.backText, { color: colors.text }]}>←</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.right} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 12,
  },
  left: {
    width: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  right: {
    width: 44,
  },
  backText: {
    fontSize: 22,
    fontWeight: "500",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
