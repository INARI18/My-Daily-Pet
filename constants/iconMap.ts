import { ImageSourcePropType } from "react-native";

const iconMap: Record<string, ImageSourcePropType[]> = {
  cats: [
    require("@/assets/icons/cats/1.png"),
    require("@/assets/icons/cats/2.png"),
    require("@/assets/icons/cats/3.png"),
    require("@/assets/icons/cats/4.png"),
    require("@/assets/icons/cats/5.png"),
    require("@/assets/icons/cats/6.png"),
    require("@/assets/icons/cats/7.png"),
    require("@/assets/icons/cats/8.png"),
    require("@/assets/icons/cats/9.png"),
    require("@/assets/icons/cats/10.png"),
    require("@/assets/icons/cats/11.png"),
    require("@/assets/icons/cats/12.png"),
  ],

  dogs: [
    require("@/assets/icons/dogs/1.png"),
    require("@/assets/icons/dogs/2.png"),
    require("@/assets/icons/dogs/3.png"),
    require("@/assets/icons/dogs/4.png"),
    require("@/assets/icons/dogs/5.png"),
    require("@/assets/icons/dogs/6.png"),
    require("@/assets/icons/dogs/7.png"),
    require("@/assets/icons/dogs/8.png"),
    require("@/assets/icons/dogs/9.png"),
    require("@/assets/icons/dogs/10.png"),
    require("@/assets/icons/dogs/11.png"),
    require("@/assets/icons/dogs/12.png"),
    require("@/assets/icons/dogs/13.png"),
    require("@/assets/icons/dogs/14.png"),
    require("@/assets/icons/dogs/15.png"),
    require("@/assets/icons/dogs/16.png"),
    require("@/assets/icons/dogs/17.png"),
    require("@/assets/icons/dogs/18.png"),
    require("@/assets/icons/dogs/19.png"),
    require("@/assets/icons/dogs/20.png"),
    require("@/assets/icons/dogs/21.png"),
    require("@/assets/icons/dogs/22.png"),
    require("@/assets/icons/dogs/23.png"),
    require("@/assets/icons/dogs/24.png"),
    require("@/assets/icons/dogs/25.png"),
    require("@/assets/icons/dogs/26.png"),
    require("@/assets/icons/dogs/27.png"),
  ],
};

export default iconMap;

// Pet icons are stored as stable ids ("dogs/3") instead of asset URIs, which
// differ between dev (Metro URL) and release builds.
export type IconSet = "cats" | "dogs";

export function iconIdFor(source: ImageSourcePropType): string | undefined {
  for (const set of ["cats", "dogs"] as IconSet[]) {
    const index = iconMap[set].indexOf(source);
    if (index >= 0) return `${set}/${index + 1}`;
  }
  return undefined;
}

export function resolveIconId(id: string): ImageSourcePropType | undefined {
  const match = /^(cats|dogs)\/(\d+)$/.exec(id);
  if (!match) return undefined;
  return iconMap[match[1] as IconSet][Number(match[2]) - 1];
}

// anything stored in iconUrl: an icon id or a legacy URI
export function petIconSource(iconUrl: string): ImageSourcePropType {
  return resolveIconId(iconUrl) ?? { uri: iconUrl };
}

export function randomIconId(type: "dog" | "cat"): string {
  const set: IconSet = type === "cat" ? "cats" : "dogs";
  return `${set}/${Math.floor(Math.random() * iconMap[set].length) + 1}`;
}
