// frontend/src/utils/theme.js
// This utility function applies the theme to the root <html> element

export const applyTheme = (theme) => {
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Default to dark mode if theme is 'dark' or any other value
    document.documentElement.classList.add('dark');
  }
};