module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.6rem",
      },
      colors: {
        default: "#be8688", // "#d71f69",
        "primary-light": "#fef5f3",
        "primary-dark": "#c08586",
      },
      fontFamily: {
        rochester: ['"Rochester"', "cursive"],
        poppins: ['"Poppins"', "sans-serif"],
        pacifico: ['"Pacifico"', "cursive"],
      },
      height: {
        "h-0.5": "0.1rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};
