/**
 * @file src/services/skillsService.js
 * @description Service for skill-related business logic and shared constants.
 */

/**
 * An array of skill level objects, defining the value and display text.
 * Used for select dropdowns and consistent ordering.
 */
export const SKILL_LEVELS = [
  {value: 'EXPERT', text: 'Expert'},
  {value: 'ADVANCED', text: 'Advanced'},
  {value: 'INTERMEDIATE', text: 'Intermediate'},
  {value: 'BEGINNER', text: 'Beginner'}
];

/**
 * Groups an array of skills by category, and then by proficiency level within each category.
 *
 * @param {Array<object>} skills - The array of skill objects to group. Each object must have 'level' and may have 'category'.
 * @returns {Array<{category: string, levels: Array<{name: string, skills: Array<object>}>}>} An array of grouped skills.
 */
export const groupSkills = (skills) => {
  if (!skills || skills.length === 0) {
    return [];
  }

  // Group all skills by their category first.
  const skillsByCategory = skills.reduce((acc, skill) => {
    // Use a default category if none is provided to handle legacy data.
    const category = skill.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  // Now, process each category group.
  const groupedResult = Object.entries(skillsByCategory).map(([category, skillsInCat]) => {
    const levels = {
      EXPERT: [],
      ADVANCED: [],
      INTERMEDIATE: [],
      BEGINNER: []
    };

    // Sort skills within the category alphabetically before assigning to levels.
    const sortedSkills = [...skillsInCat].sort((a, b) => a.name.localeCompare(b.name));

    sortedSkills.forEach(skill => {
      if (levels[skill.level]) {
        levels[skill.level].push(skill);
      }
    });

    // Format the levels for the current category, filtering out empty ones.
    const categoryLevels = [
      {name: 'Expert', skills: levels.EXPERT},
      {name: 'Advanced', skills: levels.ADVANCED},
      {name: 'Intermediate', skills: levels.INTERMEDIATE},
      {name: 'Beginner', skills: levels.BEGINNER},
    ].filter(level => level.skills.length > 0);

    return {category, levels: categoryLevels};
  });

  // Sort the final categories alphabetically.
  return groupedResult.sort((a, b) => a.category.localeCompare(b.category));
};
