import { RoyaltySettings, defaultSettings } from '../types/settings';

const SETTINGS_KEY = 'royaltySettings';

export const getSettings = (): RoyaltySettings => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  
  try {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (!savedSettings) {
      return defaultSettings;
    }
    return JSON.parse(savedSettings) as RoyaltySettings;
  } catch (error) {
    console.error('Error loading settings:', error);
    return defaultSettings;
  }
};

export const updateSettings = (settings: RoyaltySettings): boolean => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const resetSettings = (): boolean => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return true;
  } catch (error) {
    console.error('Error resetting settings:', error);
    return false;
  }
}; 