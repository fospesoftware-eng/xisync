/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#0a0a0b',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        xisync: {
          blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
          cyan: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344' },
          green: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'system-ui', '-apple-system', 'sans-serif'],
        logo: ['Manrope', 'Noto Sans SC', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'premium-sm': '0 1px 2px rgba(10, 10, 11, 0.04)',
        'premium': '0 1px 3px rgba(10, 10, 11, 0.06), 0 1px 2px -1px rgba(10, 10, 11, 0.04)',
        'premium-md': '0 4px 6px -2px rgba(10, 10, 11, 0.05), 0 10px 15px -3px rgba(10, 10, 11, 0.05)',
        'premium-lg': '0 10px 15px -3px rgba(10, 10, 11, 0.08), 0 4px 6px -4px rgba(10, 10, 11, 0.04)',
        'premium-xl': '0 20px 25px -5px rgba(10, 10, 11, 0.08), 0 8px 10px -6px rgba(10, 10, 11, 0.04)',
      },
    },
  },
  plugins: [],
};
