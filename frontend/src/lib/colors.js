// Aesthetic color palettes for Think cards
export const CARD_COLOR_PALETTES = [
  {
    bgGradient: "bg-linear-to-br from-amber-500/10 via-base-100 to-orange-500/5",
    borderHover: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    badgeClass: "badge-warning badge-outline",
    accentColor: "text-amber-600 dark:text-amber-400",
    glowColor: "from-amber-400/20 to-orange-400/20",
    headerBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  {
    bgGradient: "bg-linear-to-br from-emerald-500/10 via-base-100 to-teal-500/5",
    borderHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    badgeClass: "badge-success badge-outline",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    glowColor: "from-emerald-400/20 to-teal-400/20",
    headerBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    bgGradient: "bg-linear-to-br from-indigo-500/10 via-base-100 to-blue-500/5",
    borderHover: "hover:border-indigo-500/40 hover:shadow-indigo-500/10",
    badgeClass: "badge-primary badge-outline",
    accentColor: "text-indigo-600 dark:text-indigo-400",
    glowColor: "from-indigo-400/20 to-blue-400/20",
    headerBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  {
    bgGradient: "bg-linear-to-br from-rose-500/10 via-base-100 to-pink-500/5",
    borderHover: "hover:border-rose-500/40 hover:shadow-rose-500/10",
    badgeClass: "badge-secondary badge-outline",
    accentColor: "text-rose-600 dark:text-rose-400",
    glowColor: "from-rose-400/20 to-pink-400/20",
    headerBg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  {
    bgGradient: "bg-linear-to-br from-purple-500/10 via-base-100 to-violet-500/5",
    borderHover: "hover:border-purple-500/40 hover:shadow-purple-500/10",
    badgeClass: "badge-accent badge-outline",
    accentColor: "text-purple-600 dark:text-purple-400",
    glowColor: "from-purple-400/20 to-violet-400/20",
    headerBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  },
  {
    bgGradient: "bg-linear-to-br from-cyan-500/10 via-base-100 to-sky-500/5",
    borderHover: "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
    badgeClass: "badge-info badge-outline",
    accentColor: "text-cyan-600 dark:text-cyan-400",
    glowColor: "from-cyan-400/20 to-sky-400/20",
    headerBg: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
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
