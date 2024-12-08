/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jalnan: ["jalnan"],
      },
      boxShadow: {
        "profile-inner": "inset 0px 4px 11px 0px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
