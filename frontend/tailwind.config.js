// tailwind.config.js
module.exports = {
    // This tells Tailwind where to look for class names. It's essential.
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    
    // The theme object is where you customize Tailwind's design system.
    theme: {
      // The extend key allows you to add new values without overwriting the defaults.
      extend: {
        // Here we define our custom animation utility classes.
        animation: {
          'fade-in': 'fadeIn 0.5s ease-in-out',
          'fade-in-up': 'fadeInUp 0.5s ease-in-out',
        },
        // Here we define the actual animation steps (the keyframes).
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          fadeInUp: {
            '0%': {
              opacity: '0',
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: '1',
              transform: 'translateY(0)',
            },
          },
        },
      },
    },
  
    // Your existing plugins array.
    plugins: [
      require('tailwind-scrollbar'),
    ],
  };