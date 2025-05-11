
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getItem, setItem, getThemePreference } from '@/lib/local-storage';

type Theme = 'light' | 'dark';
type UIDensity = 'compact' | 'comfortable';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  uiDensity: UIDensity;
  setUIDensity: (density: UIDensity) => void;
  showDailyQuote: boolean;
  setShowDailyQuote: (show: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getThemePreference());
  const [uiDensity, setUIDensity] = useState<UIDensity>(
    getItem<UIDensity>('ui_density', 'comfortable')
  );
  const [showDailyQuote, setShowDailyQuote] = useState<boolean>(
    getItem<boolean>('show_daily_quote', true)
  );

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    setItem('theme', theme);
  }, [theme]);

  // Save UI density to localStorage
  useEffect(() => {
    setItem('ui_density', uiDensity);
  }, [uiDensity]);

  // Save daily quote preference to localStorage
  useEffect(() => {
    setItem('show_daily_quote', showDailyQuote);
  }, [showDailyQuote]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSetUIDensity = (density: UIDensity) => {
    setUIDensity(density);
  };

  const handleSetShowDailyQuote = (show: boolean) => {
    setShowDailyQuote(show);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        uiDensity,
        setUIDensity: handleSetUIDensity,
        showDailyQuote,
        setShowDailyQuote: handleSetShowDailyQuote,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
