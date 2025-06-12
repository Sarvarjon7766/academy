/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        'xs': '480px',
        'mdx':'840px',  // Yangi breakpoint qo‘shish
        '3xl': '1920px', // Katta ekranlar uchun qo‘shimcha breakpoint
      },
    },
  },
  plugins: [],
}

