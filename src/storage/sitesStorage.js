import AsyncStorage from "@react-native-async-storage/async-storage";

const SITES_KEY = "sites_data";

/*
SINGLE SOURCE OF TRUTH – SITE OBJECT

{
  id: "C1-S1",

  completed: false, // deployment completed or not

  arrival: {
    coords: { lat, lng, acc },
    time: "",               // string
    accessIssue: false,
    issueNote: ""
  },

  deviceSetup: {
    deviceId: "",
    customMode: false,
    batteriesOk: false,
    sdOk: false,

    startDate: "",          // DD-MM-YYYY
    startTime: "",          // HH:MM (24h)
    duration: "",           // days
    scheduleConfirmed: false
  },

  placement: { ... },
  documentation: { ... },

  groundTruth: {
    flora: { ... },
    fauna: { ... },
    photos: { ... },
    completedAt: ""         // string
  },

  retrieval: {
    arrival: {
      time: "",             // string
      referenceCoords: { lat, lng, acc }
    },

    deviceStatus: {
      battery: "",          // Full / Moderate / Low / Depleted
      condition: "",        // Dry / Wet / Damaged / Missing
      sdRemoved: false,
      note: ""
    },

    groundTruthUpdate: {
      vegetationChanged: false,
      notes: "",
      birdActivity: "",
      noiseLevel: "",
      photo: null
    },

    timeRetrieved: "",      // string
    completed: false
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

  retrieval: null, // retrieval start hone par create hoga
}));

/* ---------- HELPERS ---------- */

const safeParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const ensureInit = async () => {
  const raw = await AsyncStorage.getItem(SITES_KEY);

  if (!raw) {
    await AsyncStorage.setItem(
      SITES_KEY,
      JSON.stringify(DEFAULT_SITES)
    );
    return DEFAULT_SITES;
  }

  const parsed = safeParse(raw);
  if (!parsed || !Array.isArray(parsed)) {
    await AsyncStorage.setItem(
      SITES_KEY,
      JSON.stringify(DEFAULT_SITES)
    );
    return DEFAULT_SITES;
  }

  return parsed;
};

/* ---------- INIT ---------- */

export const initSitesIfNeeded = async () => {
  await ensureInit();
};

/* ---------- GETTERS ---------- */

export const getAllSites = async () => {
  return await ensureInit();
};

export const getSiteById = async (siteId) => {
  const sites = await ensureInit();
  return sites.find((s) => s.id === siteId) || null;
};

export const getCompletedSites = async () => {
  const sites = await ensureInit();
  return sites.filter((s) => s.completed);
};

export const isAllSitesCompleted = async () => {
  const sites = await ensureInit();
  return sites.length > 0 && sites.every((s) => s.completed);
};

/* ---------- UPDATE SITE ---------- */
/*
Use for:
arrival
deviceSetup
placement
documentation
groundTruth
retrieval
*/

export const updateSite = async (siteId, sectionData) => {
  if (!siteId || !sectionData) return;

  const sites = await ensureInit();
  let found = false;

  const updated = sites.map((site) => {
    if (site.id !== siteId) return site;
    found = true;

    return {
      ...site,
      ...sectionData, // sirf jo section bheja wahi overwrite
    };
  });

  if (!found) {
    throw new Error("Site not found: " + siteId);
  }

  await AsyncStorage.setItem(
    SITES_KEY,
    JSON.stringify(updated)
  );
};

/* ---------- MARK DEPLOYMENT COMPLETED ---------- */
/*
ONLY call from GroundTruthScreen
*/

export const markSiteCompleted = async (siteId) => {
  const sites = await ensureInit();

  const updated = sites.map((site) =>
    site.id === siteId
      ? { ...site, completed: true }
      : site
  );

  await AsyncStorage.setItem(
    SITES_KEY,
    JSON.stringify(updated)
  );
};

/* ---------- MARK RETRIEVAL COMPLETED ---------- */
/*
Call from RetrievalSummaryScreen
*/

export const markRetrievalCompleted = async (siteId) => {
  const sites = await ensureInit();

  const updated = sites.map((site) =>
    site.id === siteId
      ? {
          ...site,
          retrieval: {
            ...site.retrieval,
            completed: true,
          },
        }
      : site
  );

  await AsyncStorage.setItem(
    SITES_KEY,
    JSON.stringify(updated)
  );
};

/* ---------- RESET (DEBUG / ADMIN) ---------- */

export const resetAllSites = async () => {
  await AsyncStorage.setItem(
    SITES_KEY,
    JSON.stringify(DEFAULT_SITES)
  );
};
