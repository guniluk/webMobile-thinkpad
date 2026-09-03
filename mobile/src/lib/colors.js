// Aesthetic color palettes for Think cards in React Native
export const CARD_COLOR_PALETTES = [
  {
    bgClass: "bg-amber-500/10 border-amber-500/30",
    badgeBg: "#fef3c7",
    badgeText: "#d97706",
    badgeBorder: "#fde68a",
    accentColor: "#d97706",
    barColor: "#f59e0b",
    lightBg: "#fffbeb",
    darkBg: "#78350f",
  },
  {
    bgClass: "bg-emerald-500/10 border-emerald-500/30",
    badgeBg: "#d1fae5",
    badgeText: "#059669",
    badgeBorder: "#a7f3d0",
    accentColor: "#059669",
    barColor: "#10b981",
    lightBg: "#ecfdf5",
    darkBg: "#064e3b",
  },
  {
    bgClass: "bg-indigo-500/10 border-indigo-500/30",
    badgeBg: "#e0e7ff",
    badgeText: "#4f46e5",
    badgeBorder: "#c7d2fe",
    accentColor: "#4f46e5",
    barColor: "#6366f1",
    lightBg: "#eef2ff",
    darkBg: "#312e81",
  },
  {
    bgClass: "bg-rose-500/10 border-rose-500/30",
    badgeBg: "#ffe4e6",
    badgeText: "#e11d48",
    badgeBorder: "#fecdd3",
    accentColor: "#e11d48",
    barColor: "#f43f5e",
    lightBg: "#fff1f2",
    darkBg: "#881337",
  },
  {
    bgClass: "bg-purple-500/10 border-purple-500/30",
    badgeBg: "#f3e8ff",
    badgeText: "#9333ea",
    badgeBorder: "#e9d5ff",
    accentColor: "#9333ea",
    barColor: "#a855f7",
    lightBg: "#faf5ff",
    darkBg: "#581c87",
  },
  {
    bgClass: "bg-cyan-500/10 border-cyan-500/30",
    badgeBg: "#cffafe",
    badgeText: "#0891b2",
    badgeBorder: "#a5f3fc",
    accentColor: "#0891b2",
    barColor: "#06b6d4",
    lightBg: "#ecfeff",
    darkBg: "#164e63",
  },
];

/**
 * Returns a consistent palette for a given note ID.
 * @param {string} id - Note ID
 * @returns {object} Palette object
 */
export function getPaletteForId(id) {
  if (!id) return CARD_COLOR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % CARD_COLOR_PALETTES.length;
  return CARD_COLOR_PALETTES[index];
}
