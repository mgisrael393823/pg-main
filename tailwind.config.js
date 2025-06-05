/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#151515', // Matt Black
        secondary: '#EFEEE9', // White Mink
        accent: {
          primary: '#324038', // Roycroft Bottle Green
          secondary: '#E8B793', // Gentle Doe
          tertiary: '#F0DCCB', // Champagne Pink
        },
        neutral: {
          medium: '#795953', // Sequoia Dusk
        },
        error: '#D32F2F',
        warning: '#F57C00',
        success: '#324038', // Roycroft Bottle Green
        // Semantic colors for shadcn/ui
        foreground: 'var(--foreground)',
        'muted-foreground': 'var(--muted-foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },
    },
  },
  plugins: [],
}