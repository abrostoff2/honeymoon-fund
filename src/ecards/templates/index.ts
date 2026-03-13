import RomanticFloral from "./romantic-floral";
import TropicalSunset from "./tropical-sunset";
import MinimalistGold from "./minimalist-gold";
import WatercolorBlue from "./watercolor-blue";
import AdventureMap from "./adventure-map";

export interface EcardProps {
  guestName: string;
  coupleName: string;
  message: string;
}

export interface EcardTemplate {
  id: string;
  name: string;
  preview: string; // emoji/icon for picker
  component: React.ComponentType<EcardProps>;
}

export const ecardTemplates: EcardTemplate[] = [
  {
    id: "romantic-floral",
    name: "Romantic Floral",
    preview: "🌸",
    component: RomanticFloral,
  },
  {
    id: "tropical-sunset",
    name: "Tropical Sunset",
    preview: "🌅",
    component: TropicalSunset,
  },
  {
    id: "minimalist-gold",
    name: "Minimalist Gold",
    preview: "✨",
    component: MinimalistGold,
  },
  {
    id: "watercolor-blue",
    name: "Watercolor Blue",
    preview: "🎨",
    component: WatercolorBlue,
  },
  {
    id: "adventure-map",
    name: "Adventure Map",
    preview: "🗺️",
    component: AdventureMap,
  },
];

export function getEcardTemplate(id: string): EcardTemplate | undefined {
  return ecardTemplates.find((t) => t.id === id);
}
