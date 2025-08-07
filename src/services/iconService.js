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

// Theme-based color classes for different proficiency levels.
const levelColorClasses = {
  EXPERT: 'text-success',
  ADVANCED: 'text-info',
  /*
    FIX: The standard 'text-primary' color was too close to the skill badge's background.
    Using 'text-primary-emphasis' provides a darker shade of blue, improving contrast and readability.
  */
  INTERMEDIATE: 'text-primary-emphasis',
  BEGINNER: 'text-warning',
  DEFAULT: 'text-muted',
};

// Fallback icons for skills that have no specific icon defined.
const levelDefaultIcons = {
  EXPERT: 'bi bi-trophy-fill',
  ADVANCED: 'bi bi-lightning-charge-fill',
  INTERMEDIATE: 'bi bi-tools',
  BEGINNER: 'bi bi-lightbulb-fill',
  DEFAULT: 'bi bi-gear-wide-connected',
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
    return `${levelDefaultIcons.DEFAULT} ${levelColorClasses.DEFAULT}`;
  }

  // FIX: Only apply a color class if a proficiency level is explicitly provided.
  // On pages like Experience or Projects, skills don't have a level, so the icon
  // should inherit its color from the badge itself, rather than being forced to 'muted'.
  const level = skill.level; // Don't default to 'DEFAULT' if level is missing.
  const colorClass = level ? (levelColorClasses[level] || levelColorClasses.DEFAULT) : '';
  let baseIconClass;

  // 1. If no specific icon is provided, use the default icon for the skill's level.
  if (!skill.icon) {
    // Use the provided level, or fallback to default if level is invalid/missing.
    baseIconClass = levelDefaultIcons[level] || levelDefaultIcons.DEFAULT;
  } else {
    // 2. A specific icon is provided, so format it correctly.
    if (skill.icon.startsWith('devicon-') || skill.icon.startsWith('bi-') || skill.icon.includes(' ')) {
      baseIconClass = skill.icon;
    }
    // 3. If it's a legacy Font Awesome class (e.g., "fa-java"), add the correct v6 prefix.
    else if (skill.icon.startsWith('fa-')) {
      baseIconClass = faBrandIcons.has(skill.icon) ? `fa-brands ${skill.icon}` : `fa-solid ${skill.icon}`;
    }
    // 4. If the format is unknown, return it as-is.
    else {
      baseIconClass = skill.icon;
    }
  }

  // 5. Combine the final icon class with its level-based color class.
  return `${baseIconClass} ${colorClass}`.trim();
};

const categoryIcons = {
  'Frontend': 'bi bi-display-fill',
  'Backend': 'bi bi-server',
  'Programming Language': 'bi bi-code-slash',
  'Framework': 'bi bi-box-seam-fill',
  'DevOps': 'bi bi-cloud-arrow-up-fill',
  'Database': 'bi bi-stack',
  'Methodology': 'bi bi-diagram-3-fill',
  'default': 'bi bi-tag-fill'
};

export const getCategoryIcon = (category) => {
  if (!category) return '';
  const key = Object.keys(categoryIcons).find(k => k.toLowerCase() === category.toLowerCase().trim());
  return categoryIcons[key] || categoryIcons.default;
};
