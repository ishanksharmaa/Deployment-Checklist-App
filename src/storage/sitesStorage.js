import AsyncStorage from "@react-native-async-storage/async-storage";

const SITES_KEY = "sites_data";

/*
FULL SITE OBJECT (SINGLE SOURCE OF TRUTH)

{
  id: "C1-S1",
  completed: false,

  arrival: {
    coords: { lat, lng, acc },
    time: "",
    accessIssue: false,
    issueNote: ""
  },

  deviceSetup: {
    deviceId: "",
    customMode: false,
    batteriesOk: false,
    sdOk: false,
    duration: ""
  },

  placement: {
    heightOk: true,
    micOut: true,
    tiltDown: true,
    awayFromTrail: true,
    awayFromWater: true,
    awayFromRoad: true,
    secureAttach: true,
    waterproof: true
  },

  documentation: {
    weather: "",
    wind: "",
    rain: false,
    rainNote: "",
    disturbance: "",
    notes: "",
    coords: { lat, lng, acc },
    timeDeployed: ""
  },

  groundTruth: {
    flora: {
      vegType: "",
      canopyCover: "",
      canopyHeight: "",
      understory: "",
      stressObserved: false,
      stressNote: ""
    },
    fauna: {
      birdActivity: "",
      birdNotes: "",
      noiseLevel: ""
    }
  },

  photos: {
    landscape: null,
    canopy: null,
    device: null,
    disturbance: null
  }
}
*/

/* ---------- DEFAULT SITES ---------- */

export const DEFAULT_SITES = [
  "C1-S1",
  "C1-S2",
  "C1-S3",
  "C1-S4",
  "C1-S5",
  "C1-S6",
  "C1-S7",
].map((id) => ({
  id,
  completed: false,

  arrival: null,
  deviceSetup: null,
  placement: null,
  documentation: null,
  groundTruth: null,
  photos: null,
}));

/* ---------- INIT (APP START) ---------- */

export const initSitesIfNeeded = async () => {
  const raw = await AsyncStorage.getItem(SITES_KEY);
  if (!raw) {
    await AsyncStorage.setItem(
      SITES_KEY,
      JSON.stringify(DEFAULT_SITES)
    );
  }
};

/* ---------- GETTERS ---------- */

export const getAllSites = async () => {
  const raw = await AsyncStorage.getItem(SITES_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const getSiteById = async (siteId) => {
  const sites = await getAllSites();
  return sites.find((s) => s.id === siteId);
};

export const getCompletedSites = async () => {
  const sites = await getAllSites();
  return sites.filter((s) => s.completed);
};

export const isAllSitesCompleted = async () => {
  const sites = await getAllSites();
  return sites.length > 0 && sites.every((s) => s.completed);
};

/* ---------- CORE UPDATE FUNCTION ---------- */
/*
Use this in ALL screens:
arrival / device / placement / documentation / groundTruth / photos
*/

export const updateSite = async (siteId, sectionData) => {
  const sites = await getAllSites();

  const updated = sites.map((site) =>
    site.id === siteId
      ? {
          ...site,
          ...sectionData, // only overwrite given sections
        }
      : site
  );

  await AsyncStorage.setItem(SITES_KEY, JSON.stringify(updated));
};

/* ---------- MARK SITE COMPLETED ---------- */
/*
Call ONLY from GroundTruthScreen (final step)
*/

export const markSiteCompleted = async (siteId) => {
  const sites = await getAllSites();

  const updated = sites.map((site) =>
    site.id === siteId
      ? { ...site, completed: true }
      : site
  );

  await AsyncStorage.setItem(SITES_KEY, JSON.stringify(updated));
};

/* ---------- RESET (OPTIONAL / ADMIN) ---------- */

export const resetAllSites = async () => {
  await AsyncStorage.setItem(
    SITES_KEY,
    JSON.stringify(DEFAULT_SITES)
  );
};
