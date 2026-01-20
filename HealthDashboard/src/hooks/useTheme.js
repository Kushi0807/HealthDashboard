import { useState, useCallback } from "react";

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = useCallback(() => setDarkMode(prev => !prev), []);
  return { darkMode, toggleTheme };
};
