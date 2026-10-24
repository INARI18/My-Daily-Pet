// Design tokens. Colors come in two palettes; screens read them through useColors().

export type Palette = {
  bg: string;
  surface: string;
  cardBorder: string; // transparent in light, visible in dark (replaces the shadow)
  primary: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  onPrimary: string;
  petDog: string; // avatar tints
  petCat: string;
  paw: string; // background paw prints
  brand: string; // deep purple of the auth screens, same in both modes
  onBrand: string;
};

export const LightColors: Palette = {
  bg: "#FFF7EA",
  surface: "#FFFFFF",
  cardBorder: "transparent",
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
  petDog: "#FFF1DC",
  petCat: "#E6D3EA",
  paw: "rgba(92, 26, 92, 0.05)",
  brand: "#5C1A5C",
  onBrand: "#FFF7EA",
};

export const DarkColors: Palette = {
  // purple night with the illustrations gold as the accent
  bg: "#16101A",
  surface: "#2A1F30",
  cardBorder: "#473A4F",
  primary: "#F2B544",
  primarySoft: "#3F3047",
  accent: "#F2B544",
  accentSoft: "#3F2B48",
  text: "#FBF3F8",
  textMuted: "#C2B3C6",
  border: "#473A4F",
  success: "#BFF2D6",
  successSoft: "#1F5A3E",
  warning: "#FFE2A8",
  warningSoft: "#5A3C14",
  danger: "#FFB4AD",
  dangerSoft: "#5A2328",
  onPrimary: "#2A1F30",
  petDog: "#5A4630",
  petCat: "#4A3355",
  paw: "rgba(242, 181, 68, 0.06)",
  brand: "#3A1F3D",
  onBrand: "#FBF3F8",
};

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
