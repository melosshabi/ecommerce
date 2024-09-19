/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        orange:'rgba(var(--orange))',
        lightOrange:'rgba(var(--lightOrange))',
        transparentOrange:'rgba(var(--transparentOrange))',
        darkerOrange:'rgba(var(--darkerOrange))',
        black:'rgba(var(--black))',
        transparentBlack:'rgba(var(--transparentBlack))',
        costumWhite:'rgba(var(--white))',
        gray:'rgba(var(--gray))',
        lighterGray:'rgba(var(--lighterGray))',
        lightGray:'rgba(var(--lightGray))'
      },
      fontFamily:{
        'work-sans':["Work Sans", 'sans-serif']
      },
      screens:{
        'widescreen':'1920px'
      },
      animation:{
        'indicator': 'indicator 10s linear infinite'
      },
      keyframes:{
        indicator:{
          '0%':{'width':'0%'},
          '100%':{'width':'100%'}
        }
      }
    },
  },
  plugins: [],
}