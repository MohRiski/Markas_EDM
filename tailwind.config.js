/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        times: ['Times New Roman', 'Times', 'serif']
      }
    },
  },
  plugins: [],
}

