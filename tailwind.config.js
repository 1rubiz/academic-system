import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindScrollbar,
  ],
  darkMode: 'class',
};
