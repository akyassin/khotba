import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
} satisfies Config