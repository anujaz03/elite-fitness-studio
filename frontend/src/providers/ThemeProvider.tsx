'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'luxury-dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('luxury-dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme === 'luxury-dark' ? 'dark' : 'light';
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
