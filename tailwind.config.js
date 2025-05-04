import { colors } from "./styles/colors"
import { fontFamily } from "./styles/fontFamily"

module.exports = {
  content: ["./**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
  plugins: [],
}