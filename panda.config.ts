import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: [
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/app/**/*.{ts,tsx,js,jsx}",
  ],
  // include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          border: {
            blue: { value: "#3b82f6" },
            black: { value: "#272727" },
          },
        },
      },
      semanticTokens: {
        colors: {
          border: {
            home: { value: "{colors.border.blue}" },
            dashboard: { value: "{colors.border.black}" },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
