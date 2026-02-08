import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* ---------- DEPLOYMENT SCREENS ---------- */

import HomeScreen from "../screens/HomeScreen";
import PreDeploymentScreen from "../screens/PreDeploymentScreen";
import SiteArrivalScreen from "../screens/SiteArrivalScreen";
import DeviceSetupScreen from "../screens/DeviceSetupScreen";
import PlacementScreen from "../screens/PlacementScreen";
import DocumentationScreen from "../screens/DocumentationScreen";
import GroundTruthScreen from "../screens/GroundTruthScreen";

/* ---------- DEPLOYMENT SUMMARY ---------- */

import SiteSummaryScreen from "../screens/SiteSummaryScreen";
import DailySummaryScreen from "../screens/DailySummaryScreen";

/* ---------- RETRIEVAL FLOW (PDF SCREEN 11–15) ---------- */

import SiteRetrievalArrivalScreen from "../screens/SiteRetrievalArrivalScreen"; // Screen 11
import RecorderRetrievalScreen from "../screens/RecorderRetrievalScreen";       // Screen 12
import RetrievalGroundTruthUpdateScreen from "../screens/RetrievalGroundTruthUpdateScreen"; // Screen 13
import RetrievalSummaryScreen from "../screens/RetrievalSummaryScreen";         // Screen 14
import DataOrganizationScreen from "../screens/DataOrganizationScreen";         // Screen 15

const Stack = createNativeStackNavigator();

export default function StackNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* ---------- HOME ---------- */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* ---------- DEPLOYMENT FLOW ---------- */}
        <Stack.Screen name="PreDeployment" component={PreDeploymentScreen} />
        <Stack.Screen name="SiteArrival" component={SiteArrivalScreen} />
        <Stack.Screen name="DeviceSetup" component={DeviceSetupScreen} />
        <Stack.Screen name="Placement" component={PlacementScreen} />
        <Stack.Screen name="Documentation" component={DocumentationScreen} />
        <Stack.Screen name="GroundTruth" component={GroundTruthScreen} />

        {/* ---------- DEPLOYMENT SUMMARY ---------- */}
        <Stack.Screen name="SiteSummary" component={SiteSummaryScreen} />
        <Stack.Screen name="DailySummary" component={DailySummaryScreen} />

        {/* ---------- RETRIEVAL FLOW ---------- */}
        <Stack.Screen
          name="SiteRetrievalArrival"
          component={SiteRetrievalArrivalScreen}
        />
        <Stack.Screen
          name="RecorderRetrieval"
          component={RecorderRetrievalScreen}
        />
        <Stack.Screen
          name="RetrievalGroundTruthUpdate"
          component={RetrievalGroundTruthUpdateScreen}
        />
        <Stack.Screen
          name="RetrievalSummary"
          component={RetrievalSummaryScreen}
        />
        <Stack.Screen
          name="DataOrganization"
          component={DataOrganizationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
