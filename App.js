import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import StackNav from "./src/navigation/StackNav";

export default function App() {
  const scheme = useColorScheme(); // system theme

  return (
    <>
      <StackNav />
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
    </>
  );
}
