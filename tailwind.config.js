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
      fontSize: {
        // Responsive font sizes using clamp()
        'xs': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.5' }],
        'sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(1rem, 2.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.125rem, 3vw, 1.25rem)', { lineHeight: '1.6' }],
        'xl': ['clamp(1.25rem, 3.5vw, 1.5rem)', { lineHeight: '1.5' }],
        '2xl': ['clamp(1.5rem, 4vw, 1.875rem)', { lineHeight: '1.4' }],
        '3xl': ['clamp(1.875rem, 5vw, 2.25rem)', { lineHeight: '1.3' }],
        '4xl': ['clamp(2.25rem, 6vw, 3rem)', { lineHeight: '1.2' }],
        '5xl': ['clamp(3rem, 8vw, 3.75rem)', { lineHeight: '1.1' }],
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