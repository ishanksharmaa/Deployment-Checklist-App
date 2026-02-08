import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ScrollView,
  Image,
} from "react-native";

import { LightTheme, DarkTheme } from "../constants/theme";
import Header from "../components/Header";
import { setCurrentStep } from "../storage/progressStorage";
import {
  getAllSites,
  getSiteById,
  isAllSitesCompleted,
} from "../storage/sitesStorage";

export default function SiteSummaryScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? DarkTheme : LightTheme;

  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedSite, setSelectedSite] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    const data = await getAllSites();
    setSites(data);
  };

  const onSelectSite = async (site) => {
    if (!site.completed) {
      Alert.alert(
        "Summary not available",
        "Please complete this site to view its summary."
      );
      return;
    }

    const fullSite = await getSiteById(site.id);
    setSelectedSiteId(site.id);
    setSelectedSite(fullSite);
    setOpen(false);
  };

  const onProceed = async () => {
    await setCurrentStep(2);

    const allDone = await isAllSitesCompleted();
    if (allDone) {
      navigation.replace("DailySummary");
    } else {
      navigation.navigate("Home");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Site Summary"
        colors={colors}
        onBack={() => navigation.navigate("Home")}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* ---------- SITE DROPDOWN ---------- */}
        <Text style={[styles.label, { color: colors.text }]}>
          Select site
        </Text>

        <TouchableOpacity
          style={[styles.dropdown, { borderColor: colors.border }]}
          onPress={() => setOpen(!open)}
        >
          <Text style={{ color: selectedSiteId ? colors.text : "#999" }}>
            {selectedSiteId || "Choose site"}
          </Text>
        </TouchableOpacity>

        {open &&
          sites.map((site) => (
            <TouchableOpacity
              key={site.id}
              style={[
                styles.option,
                {
                  backgroundColor: site.completed
                    ? colors.card
                    : "#00000010",
                  borderColor: site.completed
                    ? colors.border
                    : "#ccc",
                },
              ]}
              onPress={() => onSelectSite(site)}
            >
              <Text
                style={{
                  color: site.completed ? colors.text : "#999",
                }}
              >
                {site.id}
                {!site.completed && " (not completed)"}
              </Text>
            </TouchableOpacity>
          ))}

        {/* ---------- SUMMARY ---------- */}
        {selectedSite ? (
          <View>
            {/* ARRIVAL */}
            <Section title="Site Arrival" colors={colors}>
              <Row label="Latitude" value={selectedSite.arrival?.coords?.lat} />
              <Row label="Longitude" value={selectedSite.arrival?.coords?.lng} />
              <Row label="Time" value={selectedSite.arrival?.time} />
              <Row
                label="Access Issue"
                value={
                  selectedSite.arrival?.accessIssue ? "Yes" : "No"
                }
              />
              {selectedSite.arrival?.issueNote ? (
                <Row
                  label="Issue Note"
                  value={selectedSite.arrival.issueNote}
                />
              ) : null}
            </Section>

            {/* DEVICE */}
            <Section title="Device Setup" colors={colors}>
              <Row label="Device ID" value={selectedSite.deviceSetup?.deviceId} />
              <Row label="Custom Mode" value={selectedSite.deviceSetup?.customMode ? "Yes" : "No"} />
              <Row label="Batteries OK" value={selectedSite.deviceSetup?.batteriesOk ? "Yes" : "No"} />
              <Row label="SD Card OK" value={selectedSite.deviceSetup?.sdOk ? "Yes" : "No"} />
              <Row label="Duration" value={selectedSite.deviceSetup?.duration} />
            </Section>

            {/* PLACEMENT */}
            <Section title="Placement" colors={colors}>
              <Text style={styles.okText}>✓ All placement checks completed</Text>
            </Section>

            {/* DOCUMENTATION */}
            <Section title="Deployment Documentation" colors={colors}>
              <Row label="Weather" value={selectedSite.documentation?.weather} />
              <Row label="Wind" value={selectedSite.documentation?.wind} />
              <Row label="Recent Rain" value={selectedSite.documentation?.rain ? "Yes" : "No"} />
              {selectedSite.documentation?.rainNote ? (
                <Row label="Rain Note" value={selectedSite.documentation.rainNote} />
              ) : null}
              {selectedSite.documentation?.disturbance ? (
                <Row label="Disturbance" value={selectedSite.documentation.disturbance} />
              ) : null}
              {selectedSite.documentation?.notes ? (
                <Row label="Notes" value={selectedSite.documentation.notes} />
              ) : null}
            </Section>

            {/* GROUND TRUTH */}
            <Section title="Ground Truthing" colors={colors}>
              <Row label="Vegetation" value={selectedSite.groundTruth?.flora?.vegType} />
              <Row label="Canopy Cover" value={selectedSite.groundTruth?.flora?.canopyCover} />
              <Row label="Canopy Height" value={selectedSite.groundTruth?.flora?.canopyHeight} />
              <Row label="Understory" value={selectedSite.groundTruth?.flora?.understory} />
              <Row label="Bird Activity" value={selectedSite.groundTruth?.fauna?.birdActivity} />
              <Row label="Noise Level" value={selectedSite.groundTruth?.fauna?.noiseLevel} />
            </Section>

            {/* PHOTOS */}
            <Section title="Photos" colors={colors}>
              <Photo uri={selectedSite.photos?.landscape} label="Landscape" />
              <Photo uri={selectedSite.photos?.canopy} label="Canopy" />
              <Photo uri={selectedSite.photos?.device} label="Device Placement" />
              {selectedSite.photos?.disturbance && (
                <Photo uri={selectedSite.photos.disturbance} label="Disturbance" />
              )}
            </Section>
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={{ color: colors.text, opacity: 0.6 }}>
              Select a completed site to view summary
            </Text>
          </View>
        )}

        {/* PROCEED */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#2ecc71" }]}
          onPress={onProceed}
        >
          <Text style={styles.btnText}>Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Section({ title, children, colors }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{String(value)}</Text>
    </View>
  );
}

function Photo({ uri, label }) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.photoLabel}>{label}</Text>
      <Image source={{ uri }} style={styles.photo} />
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { padding: 20 },

  label: { marginBottom: 6, fontWeight: "500" },

  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },

  option: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },

  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
  },

  sectionTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  rowLabel: { fontSize: 13, opacity: 0.7 },
  rowValue: { fontSize: 13, fontWeight: "500" },

  okText: {
    color: "#2ecc71",
    fontWeight: "600",
  },

  photoLabel: {
    fontSize: 13,
    marginBottom: 4,
    opacity: 0.7,
  },

  photo: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },

  empty: {
    alignItems: "center",
    marginTop: 40,
  },

  btn: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "600" },
});
