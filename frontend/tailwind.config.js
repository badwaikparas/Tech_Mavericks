/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(0, 0%, 0%)",
        foreground: "hsl(0, 0%, 100%)",
        card: "hsl(240, 10%, 3.9%)",
        "card-foreground": "hsl(0, 0%, 98%)",
        popover: "hsl(240, 10%, 3.9%)",
        "popover-foreground": "hsl(0, 0%, 98%)",
        primary: "hsl(270, 70%, 60%)",
        "primary-foreground": "hsl(0, 0%, 100%)",
        secondary: "hsl(180, 70%, 50%)",
        "secondary-foreground": "hsl(0, 0%, 100%)",
        accent: "hsl(330, 70%, 60%)",
        "accent-foreground": "hsl(0, 0%, 100%)",
        muted: "hsl(240, 3.7%, 15.9%)",
        "muted-foreground": "hsl(240, 5%, 64.9%)",
        destructive: "hsl(0, 62.8%, 30.6%)",
        "destructive-foreground": "hsl(0, 0%, 98%)",
        border: "hsl(240, 3.7%, 15.9%)",
        input: "hsl(240, 3.7%, 15.9%)",
        ring: "hsl(240, 4.9%, 83.9%)",
      },
    },
  },
  plugins: [],
};
