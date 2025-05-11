
type StorageKey = 
  | 'theme'
  | 'analytics_range'
  | 'show_daily_quote'
  | 'ui_density'
  | 'auth_token'
  | 'refresh_token'
  | 'user'
  | 'habits';

// Default values for user preferences
const defaultValues: Record<StorageKey, any> = {
  theme: 'light',
  analytics_range: 'week',
  show_daily_quote: true,
  ui_density: 'comfortable',
  auth_token: null,
  refresh_token: null,
  user: null,
  habits: []
};

/**
 * Get an item from localStorage with type safety
 */
export function getItem<T>(key: StorageKey, defaultValue: T): T {
  try {
    const item = window.localStorage.getItem(`habit_vault_${key}`);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Set an item in localStorage with type safety
 */
export function setItem(key: StorageKey, value: any): void {
  try {
    if (value === undefined) {
      window.localStorage.removeItem(`habit_vault_${key}`);
    } else {
      window.localStorage.setItem(`habit_vault_${key}`, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
}

/**
 * Remove an item from localStorage
 */
export function removeItem(key: StorageKey): void {
  try {
    window.localStorage.removeItem(`habit_vault_${key}`);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}

/**
 * Get the user's theme preference or default to dark mode
 */
export function getThemePreference(): 'dark' | 'light' {
  const storedTheme = getItem('theme', null);
  
  if (storedTheme) {
    return storedTheme as 'dark' | 'light';
  }
  
  // Default to dark mode for all new users
  return 'dark';
}

/**
 * Clear all HabitVault related data from localStorage
 */
export function clearAllData(): void {
  try {
    Object.keys(defaultValues).forEach(key => {
      window.localStorage.removeItem(`habit_vault_${key}`);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
