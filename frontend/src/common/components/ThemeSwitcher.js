import React from 'react';
const ThemeSwitcher = ({ theme, onToggle }) => (
  <button onClick={onToggle}>
    Switch to {theme === 'light' ? 'dark' : 'light'} mode
  </button>
);
export default ThemeSwitcher;
