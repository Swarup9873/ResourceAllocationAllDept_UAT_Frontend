module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-purple": "#081A51",
        "light-white": "rgba(255,255,255,0.17)",
        "alabaster": "#EDEADE",
        "bone-white": "#F9F6EE",
      },
      fontSize: {
        xs: "13px",
        sm: "13px",
        base: "13px",
        lg: "13px",
        xl: "13px",
      },
    },
  },
  plugins: [],
};