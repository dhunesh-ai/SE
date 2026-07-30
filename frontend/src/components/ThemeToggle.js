import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle Component
 * Displays a button with animated Sun/Moon icons to toggle between Light and Dark mode.
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
    >
      <div className={`theme-toggle-icon-container ${isDark ? 'is-dark' : 'is-light'}`}>
        {isDark ? (
          <Sun size={20} className="theme-icon sun-icon" />
        ) : (
          <Moon size={20} className="theme-icon moon-icon" />
        )}
      </div>
      <span className="theme-toggle-label">{isDark ? 'Light' : 'Dark'} Mode</span>
    </button>
  );
};

export default ThemeToggle;
