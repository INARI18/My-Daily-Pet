// Design tokens. See docs/superpowers/specs/2026-10-23-redesign-design.md

export const Colors = {
  bg: "#FFF7EA",
  surface: "#FFFFFF",
  primary: "#5C1A5C",
  primarySoft: "#EFE6F2",
  // single-hue palette: the accent is a lighter purple, not a second color
  accent: "#9B4D9B",
  accentSoft: "#E6D3EA",
  text: "#3A2740",
  textMuted: "#8A7A80",
  border: "#F0E6DA",
  success: "#1E6B45",
  successSoft: "#D8F3E6",
  warning: "#9A3E1F",
  warningSoft: "#FFD9CC",
  danger: "#B3261E",
  dangerSoft: "#FBE0DD",
  onPrimary: "#FFFFFF",
} as const;

export const Fonts = {
  title: "Baloo2_800ExtraBold",
  titleMedium: "Baloo2_700Bold",
  body: "Nunito_400Regular",
  bodyStrong: "Nunito_600SemiBold",
  bodyBold: "Nunito_800ExtraBold",
} as const;

export const Radius = {
  chip: 12,
  control: 14,
  card: 18,
  avatar: 26,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const Shadow = {
  card: {
    shadowColor: "#785028",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
} as const;
