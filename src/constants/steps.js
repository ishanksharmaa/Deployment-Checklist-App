// ================================
// DEPLOYMENT + RETRIEVAL STEPS
// Used on HomeScreen
// ================================

export const STEPS = [
  /* ---------- DEPLOYMENT FLOW ---------- */

  {
    id: 1,
    title: "Pre-Deployment Checklist",
    screen: "PreDeployment",
    type: "deployment",
  },
  {
    id: 2,
    title: "Site Arrival Setup",
    screen: "SiteArrival",
    type: "deployment",
  },
  {
    id: 3,
    title: "Device Setup",
    screen: "DeviceSetup",
    type: "deployment",
  },
  {
    id: 4,
    title: "Placement Checklist",
    screen: "Placement",
    type: "deployment",
  },
  {
    id: 5,
    title: "Deployment Documentation",
    screen: "Documentation",
    type: "deployment",
  },
  {
    id: 6,
    title: "Ground Truthing",
    screen: "GroundTruth",
    type: "deployment",
  },

  /* ---------- RETRIEVAL FLOW ---------- */

  {
    id: 11,
    title: "Site Retrieval Arrival",
    screen: "SiteRetrievalArrival",
    type: "retrieval",
  },
  {
    id: 12,
    title: "Recorder Retrieval",
    screen: "RecorderRetrieval",
    type: "retrieval",
  },
  {
    id: 13,
    title: "Ground Truth Update",
    screen: "GroundTruthUpdate",
    type: "retrieval",
  },
  {
    id: 14,
    title: "Retrieval Summary",
    screen: "RetrievalSummary",
    type: "retrieval",
  },
  {
    id: 15,
    title: "Data Organization",
    screen: "DataOrganization",
    type: "retrieval",
  },
];

/* ---------- SUMMARY SCREENS ---------- */

export const SUMMARY_SCREENS = {
  site: "SiteSummary",
  daily: "DailySummary",
};
