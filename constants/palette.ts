// constants/palette.ts

export const Palette = {
  // Cores Roxas (do Figma)
  purple: {
    main: "#912391", // Roxo magenta principal
    light: "#A626A6", // Roxo médio
    dark: "#7B297B", // Roxo escuro
    darker: "#5C1A5C", // Roxo mais escuro (sombras, whiskers)
  },

  // Cores Amarelas (do Figma)
  yellow: {
    main: "#fcbe62ff", // Amarelo dourado (título "My Daily Pet")
  },

  // Cores Neutras (do Figma)
  neutral: {
    white: "#FFFFFF",
    offWhite: "#F3F3F3", // Branco acinzentado suave (cards)
    black: "#000000",
    gray: "#6B7280",
    lightGray: "#EFEFEF",
  },
} as const;

export type PaletteColors = typeof Palette;
