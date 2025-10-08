/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './entrypoints/**/*.{vue,ts,html}',
    './components/**/*.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
};

