import AsyncStorage from "@react-native-async-storage/async-storage";

const STEP_KEY = "currentStep";       // 1–6 (deployment steps)
const SITE_INDEX_KEY = "currentSite"; // 0–6 (7 sites total)
const TOTAL_SITES = 7;

// step handling
export const getCurrentStep = async () => {
  const step = await AsyncStorage.getItem(STEP_KEY);
  return step ? Number(step) : 1;
};

export const setCurrentStep = async (step) => {
  await AsyncStorage.setItem(STEP_KEY, String(step));
};

// site handling
export const getCurrentSiteIndex = async () => {
  const site = await AsyncStorage.getItem(SITE_INDEX_KEY);
  return site ? Number(site) : 0;
};

export const incrementSiteIndex = async () => {
  const current = await getCurrentSiteIndex();
  const next = current + 1;
  await AsyncStorage.setItem(SITE_INDEX_KEY, String(next));
  return next;
};

// reset after deployment day
export const resetDeploymentDay = async () => {
  await AsyncStorage.setItem(STEP_KEY, "1");
  await AsyncStorage.setItem(SITE_INDEX_KEY, "0");
};

// helpers
export const isLastSite = async () => {
  const site = await getCurrentSiteIndex();
  return site >= TOTAL_SITES - 1;
};
