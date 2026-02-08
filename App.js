import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";

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
      // ensure sites storage is initialized once
      await initSitesIfNeeded();
    } catch (err) {
      console.log("App init error:", err);
      // fail-safe: app should still open
    } finally {
      setReady(true);
    }
  };

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        style={scheme === "dark" ? "light" : "dark"}
        translucent
        backgroundColor="transparent"
      />
      <StackNav />
    </>
  );
}
