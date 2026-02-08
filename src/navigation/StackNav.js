import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// main screens
import HomeScreen from "../screens/HomeScreen";
import PreDeploymentScreen from "../screens/PreDeploymentScreen";
import SiteArrivalScreen from "../screens/SiteArrivalScreen";
import DeviceSetupScreen from "../screens/DeviceSetupScreen";
import PlacementScreen from "../screens/PlacementScreen";
import DocumentationScreen from "../screens/DocumentationScreen";
import GroundTruthScreen from "../screens/GroundTruthScreen";

// ground truth flow
// import GroundTruthFloraScreen from "../screens/GroundTruthFloraScreen";
// import GroundTruthFaunaScreen from "../screens/GroundTruthFaunaScreen";
// import PhotoDocumentationScreen from "../screens/PhotoDocumentationScreen";

// summaries
import SiteSummaryScreen from "../screens/SiteSummaryScreen";
import DailySummaryScreen from "../screens/DailySummaryScreen";

const Stack = createNativeStackNavigator();

export default function StackNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="PreDeployment" component={PreDeploymentScreen} />
        <Stack.Screen name="SiteArrival" component={SiteArrivalScreen} />
        <Stack.Screen name="DeviceSetup" component={DeviceSetupScreen} />
        <Stack.Screen name="Placement" component={PlacementScreen} />
        <Stack.Screen name="Documentation" component={DocumentationScreen} />
        <Stack.Screen name="GroundTruth" component={GroundTruthScreen} />

        {/* ground truth internal flow */}
        {/* <Stack.Screen
          name="GroundTruthFlora"
          component={GroundTruthFloraScreen}
        />
        <Stack.Screen
          name="GroundTruthFauna"
          component={GroundTruthFaunaScreen}
        />
        <Stack.Screen
          name="PhotoDocumentation"
          component={PhotoDocumentationScreen}
        /> */}

        {/* auto screens */}
        <Stack.Screen name="SiteSummary" component={SiteSummaryScreen} />
        <Stack.Screen name="DailySummary" component={DailySummaryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
