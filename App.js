import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View, ActivityIndicator } from "react-native";

import { initSitesIfNeeded } from "./src/storage/sitesStorage";
import StackNav from "./src/navigation/StackNav";

export default function App() {
  const scheme = useColorScheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      await initSitesIfNeeded();
      setReady(true);
    } catch (err) {
      console.error("App init failed:", err);
      setReady(true); // fail-safe: allow app to load
    }
  };

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      {/* Transparent system status bar */}
      <StatusBar
        style={scheme === "dark" ? "light" : "dark"}
        translucent
        backgroundColor="transparent"
      />

      <StackNav />
    </>
  );
}
