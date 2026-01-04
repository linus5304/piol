/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      // Airbnb-inspired border radius (12px base)
      borderRadius: {
        none: '0',
        sm: '8px',       // Small elements
        DEFAULT: '12px', // Default (cards, buttons)
        md: '12px',      // Same as default
        lg: '16px',      // Larger cards
        xl: '24px',      // Modals, hero sections
        '2xl': '32px',   // Large decorative
        '3xl': '48px',   // Extra large
        full: '9999px',  // Pills, avatars
      },
      // Font family
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      // Brand colors
      colors: {
        brand: {
          coral: '#FF385C',
          'coral-dark': '#E31C5F',
          'coral-light': '#FF5A7D',
          'coral-pale': '#FFE4E8',
        },
      },
      // Airbnb-style shadows
      boxShadow: {
        'card': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 6px 20px rgba(0, 0, 0, 0.18)',
        'card-lift': '0 12px 28px rgba(0, 0, 0, 0.15)',
        'dropdown': '0 2px 16px rgba(0, 0, 0, 0.12)',
        'modal': '0 8px 28px rgba(0, 0, 0, 0.28)',
      },
      // Smooth transitions
      transitionDuration: {
        DEFAULT: '200ms',
      },
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
};
