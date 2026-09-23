import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccentColor, ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  accent: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentColor) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ACCENT_OPTIONS: { id: AccentColor; label: string; color: string; border: string }[] = [
  { id: 'blue', label: 'Cyber Blue', color: '#0284c7', border: '#38bdf8' },
  { id: 'purple', label: 'Electric Purple', color: '#8b5cf6', border: '#a78bfa' },
  { id: 'teal', label: 'Teal', color: '#0d9488', border: '#2dd4bf' },
  { id: 'emerald', label: 'Emerald', color: '#059669', border: '#34d399' },
  { id: 'amber', label: 'Amber', color: '#d97706', border: '#fbbf24' },
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('catchphish_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'dark'; // Default Dark Mode
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('catchphish_accent');
      if (saved && ['blue', 'purple', 'teal', 'emerald', 'amber'].includes(saved)) {
        return saved as AccentColor;
      }
    } catch {
      // ignore
    }
    return 'blue'; // Default Cyber Blue
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('catchphish_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    try {
      localStorage.setItem('catchphish_accent', accent);
    } catch {
      // ignore
    }
  }, [accent]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
  };

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
