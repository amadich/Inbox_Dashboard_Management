import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '850px',
      // => @media (min-width: 640px) { ... }

      'md': '1168px',
      // => @media (min-width: 768px) { ... }

      'lg': '1224px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1380px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },

  daisyui: {
    themes: ["cupcake" , "cymk"],
  },
  plugins: [
    require('daisyui'),
  ],
} satisfies Config;
