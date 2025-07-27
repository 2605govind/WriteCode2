// ✅ tailwind.config.js me likhna hai
exports = {
  darkMode: 'class', 
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // LeetCode dark theme colors
        'dark-layer-1': '#1A1A1A',
        'dark-layer-2': '#282828',
        'dark-layer-3': '#373737',
        'dark-border': '#3E3E3E',
        'dark-fill-1': '#2C2C2C',
        'dark-fill-2': '#3A3A3A',
        'dark-fill-3': '#4B4B4B',
        'dark-label-1': '#E8E8E8',
        'dark-label-2': '#BBBBBB',
        'dark-label-3': '#8D8D8D',
        'dark-label-4': '#5F5F5F',
        'brand-orange': '#FFA116',
        'dark-blue': '#0A84FF',
        'dark-blue-s': '#0079D3',
        'dark-yellow': '#FFC227',
        'dark-yellow-s': '#FFB800',
        'dark-pink': '#EF476F',
        'dark-green-s': '#00B8A3',
        'dark-red': '#FF375F',
      },
    },
  },
  plugins: [],
};


