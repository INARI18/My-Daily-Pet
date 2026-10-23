// Temporary shim for the legacy Themed* components until every screen uses the kit.
import { Colors } from "@/constants/theme";

const LEGACY: Record<string, string> = {
  text: Colors.text,
  background: Colors.bg,
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: "text" | "background"
) {
  return props.light ?? LEGACY[colorName];
}
