import { useEffect } from "react";
import { initSitesIfNeeded } from "./src/storage/sitesStorage";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import StackNav from "./src/navigation/StackNav";

export default function App() {
  const scheme = useColorScheme();

   useEffect(() => {
    initSitesIfNeeded();
  }, []);

  return (
    <>
      {/* Transparent system status bar */}
      <StatusBar
        // style={scheme === "dark" ? "light" : "dark"}
        translucent
        backgroundColor="transparent"
      />

      <StackNav />
    </>
  );
}
