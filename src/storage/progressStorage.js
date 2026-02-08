import AsyncStorage from "@react-native-async-storage/async-storage";

const STEP_KEY = "currentStep";

export const getCurrentStep = async () => {
  const step = await AsyncStorage.getItem(STEP_KEY);
  return step ? Number(step) : 1;
};

export const setCurrentStep = async (step) => {
  await AsyncStorage.setItem(STEP_KEY, String(step));
};
