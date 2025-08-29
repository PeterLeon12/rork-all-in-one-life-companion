import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
}

const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#667eea',
  secondary: '#764ba2',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  border: '#E9ECEF',
  card: '#FFFFFF',
  notification: '#FF6B6B',
  error: '#E74C3C',
  success: '#2ECC71',
  warning: '#F39C12'
};

const darkTheme: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#667eea',
  secondary: '#764ba2',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  card: '#1E1E1E',
  notification: '#FF6B6B',
  error: '#E74C3C',
  success: '#2ECC71',
  warning: '#F39C12'
};

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadThemePreference = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveThemePreference = useCallback(async (darkMode: boolean) => {
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, []);

  useEffect(() => {
    loadThemePreference();
  }, [loadThemePreference]);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    saveThemePreference(newTheme);
  }, [isDarkMode, saveThemePreference]);

  const setTheme = useCallback((darkMode: boolean) => {
    setIsDarkMode(darkMode);
    saveThemePreference(darkMode);
  }, [saveThemePreference]);

  const theme = useMemo(() => {
    return isDarkMode ? darkTheme : lightTheme;
  }, [isDarkMode]);

  const statusBarStyle = useMemo(() => {
    return isDarkMode ? 'light' : 'dark';
  }, [isDarkMode]);

  return useMemo(() => ({
    isDarkMode,
    theme,
    statusBarStyle,
    isLoading,
    toggleTheme,
    setTheme
  }), [
    isDarkMode,
    theme,
    statusBarStyle,
    isLoading,
    toggleTheme,
    setTheme
  ]);
});