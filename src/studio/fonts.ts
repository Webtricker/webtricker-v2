import { Inter_Tight, Newsreader, IBM_Plex_Mono, Gotu } from "next/font/google";

// Studio design typefaces. The CSS custom properties are consumed in studio-extra.css.
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-inter",
  display: "swap",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
  variable: "--f-newsreader",
  display: "swap",
  preload: false, // not needed for first paint; avoids competing with the main font and hero for bandwidth
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-plex",
  display: "swap",
  preload: false, // not needed for first paint; avoids competing with the main font and hero for bandwidth
});
const gotu = Gotu({
  subsets: ["latin"],
  weight: "400",
  variable: "--f-gotu",
  display: "swap",
  preload: false, // not needed for first paint; avoids competing with the main font and hero for bandwidth
});

export const studioFontClass = `${interTight.variable} ${newsreader.variable} ${plexMono.variable} ${gotu.variable}`;
