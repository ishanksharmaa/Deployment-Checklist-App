// Main deployment steps shown on Home screen

export const STEPS = [
  {
    id: 1,
    title: "Pre-Deployment Checklist",
    screen: "PreDeployment",
  },
  {
    id: 2,
    title: "Site Arrival Setup",
    screen: "SiteArrival",
  },
  {
    id: 3,
    title: "Device Setup",
    screen: "DeviceSetup",
  },
  {
    id: 4,
    title: "Placement Checklist",
    screen: "Placement",
  },
  {
    id: 5,
    title: "Deployment Documentation",
    screen: "Documentation",
  },
  {
    id: 6,
    title: "Ground Truthing",
    screen: "GroundTruthFlora", // entry point for ground truth
  },
];

export const GROUND_TRUTH_FLOW = [
  {
    id: "flora",
    screen: "GroundTruthFlora",
  },
  {
    id: "fauna",
    screen: "GroundTruthFauna",
  },
  {
    id: "photos",
    screen: "PhotoDocumentation",
  },
];

// Summary screens (auto navigation)
export const SUMMARY_SCREENS = {
  site: "SiteSummary",
  daily: "DailySummary",
};
