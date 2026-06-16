export const isSoundEnabled = () => {

  const savedSettings = JSON.parse(
    localStorage.getItem("settings")
  );

  return savedSettings?.soundEffects ?? true;

};