// Browser storage utilities for caching user preferences

const STORAGE_KEYS = {
  MATCH_THRESHOLD: 'xml-compare-match-threshold',
  IGNORED_PROPERTIES: 'xml-compare-ignored-properties',
  COMPARISON_MODE: 'xml-compare-mode',
} as const;

export interface UserPreferences {
  matchThreshold: number;
  ignoredProperties: string[];
  comparisonMode: string;
}

/**
 * Save a value to localStorage
 */
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

/**
 * Load a value from localStorage
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
  }
  return defaultValue;
};

/**
 * Save match threshold to browser storage
 */
export const saveMatchThreshold = (threshold: number): void => {
  saveToStorage(STORAGE_KEYS.MATCH_THRESHOLD, threshold);
};

/**
 * Load match threshold from browser storage with default fallback
 */
export const loadMatchThreshold = (): number => {
  return loadFromStorage(STORAGE_KEYS.MATCH_THRESHOLD, 95);
};

/**
 * Save ignored properties to browser storage
 */
export const saveIgnoredProperties = (properties: string[]): void => {
  saveToStorage(STORAGE_KEYS.IGNORED_PROPERTIES, properties);
};

/**
 * Load ignored properties from browser storage
 */
export const loadIgnoredProperties = (): string[] => {
  return loadFromStorage(STORAGE_KEYS.IGNORED_PROPERTIES, []);
};

/**
 * Save comparison mode to browser storage
 */
export const saveComparisonMode = (mode: string): void => {
  saveToStorage(STORAGE_KEYS.COMPARISON_MODE, mode);
};

/**
 * Load comparison mode from browser storage
 */
export const loadComparisonMode = (): string => {
  return loadFromStorage(STORAGE_KEYS.COMPARISON_MODE, 'text');
};

/**
 * Load all user preferences from browser storage
 */
export const loadUserPreferences = (): UserPreferences => {
  return {
    matchThreshold: loadMatchThreshold(),
    ignoredProperties: loadIgnoredProperties(),
    comparisonMode: loadComparisonMode(),
  };
};

/**
 * Save all user preferences to browser storage
 */
export const saveUserPreferences = (preferences: Partial<UserPreferences>): void => {
  if (preferences.matchThreshold !== undefined) {
    saveMatchThreshold(preferences.matchThreshold);
  }
  if (preferences.ignoredProperties !== undefined) {
    saveIgnoredProperties(preferences.ignoredProperties);
  }
  if (preferences.comparisonMode !== undefined) {
    saveComparisonMode(preferences.comparisonMode);
  }
};

/**
 * Clear all stored preferences
 */
export const clearUserPreferences = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}; 