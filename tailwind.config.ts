import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.7)', opacity: '0' },
          '70%': { transform: 'scale(1.12)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        pop: 'pop 300ms ease-out'
      }
    }
  },
  plugins: []
} satisfies Config;
