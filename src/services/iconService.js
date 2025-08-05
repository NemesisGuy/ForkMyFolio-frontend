/**
 * @file src/services/iconService.js
 * @description Centralized logic for rendering skill icons from various libraries and formats.
 */

// A set of legacy Font Awesome icons that should use the `fa-brands` prefix.
const faBrandIcons = new Set([
  'fa-java', 'fa-js', 'fa-vuejs', 'fa-react', 'fa-angular', 'fa-node-js',
  'fa-python', 'fa-php', 'fa-html5', 'fa-css3-alt', 'fa-git-alt',
  'fa-github', 'fa-linkedin', 'fa-docker', 'fa-bootstrap'
]);

// Fallback icons for skills that have no icon defined at all.
const levelIcons = {
  EXPERT: 'bi bi-trophy-fill text-success',
  ADVANCED: 'bi bi-lightning-charge-fill text-info',
  INTERMEDIATE: 'bi bi-tools text-primary',
  BEGINNER: 'bi bi-lightbulb-fill text-warning',
  DEFAULT: 'bi bi-gear-wide-connected text-muted',
};

/**
 * Determines the correct CSS class for a skill's icon.
 * It handles modern multi-class icons, legacy Font Awesome icons, and provides a fallback.
 * @param {object} skill The skill object from the API, must contain `icon` and `level` properties.
 * @returns {string} The appropriate CSS class for the <i> tag.
 */
export const getIconClass = (skill) => {
  // Ensure skill object exists to prevent errors
  if (!skill) {
    return levelIcons.DEFAULT;
  }

  const {icon, level} = skill;

  // 1. If no icon is provided in the data, fall back to a level-based icon.
  if (!icon) {
    return levelIcons[level] || levelIcons.DEFAULT;
  }

  // 2. If the icon class is already modern (Devicon, Bootstrap, or FA v6), use it directly.
  if (icon.startsWith('devicon-') || icon.startsWith('bi-') || icon.includes(' ')) {
    return icon;
  }

  // 3. If it's a legacy Font Awesome class (e.g., "fa-java"), add the correct v6 prefix.
  if (icon.startsWith('fa-')) {
    if (faBrandIcons.has(icon)) {
      return `fa-brands ${icon}`; // e.g., "fa-brands fa-java"
    }
    // Assume all other legacy 'fa-' icons are solid.
    return `fa-solid ${icon}`; // e.g., "fa-solid fa-leaf"
  }

  // 4. If the format is unknown, return it as-is.
  return icon;
};
