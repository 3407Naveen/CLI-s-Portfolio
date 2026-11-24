// ============================================================
// COMMAND REGISTRY — Maps command names to handlers
// ============================================================

export const COMMAND_LIST = [
  'help',
  'home',
  'about',
  'projects',
  'skills',
  'experience',
  'education',
  'achievements',
  'leadership',
  'leadership campusx',
  'leadership markathon',
  'leadership zero-ai',
  'leadership aavishkar',
  'leadership fundamentals',
  'leadership stitch24',
  'career path',
  'resume',
  'certifications',
  'currently building',
  'contact',
  'view aegis',
  'view buildvisor',
  'view bharat-bazar',
  'view nidhi',
  'view farmbazzar',
  'github aegis',
  'github buildvisor',
  'github bharat-bazar',
  'github nidhi',
  'github farmbazzar',
  'demo bharat-bazar',
  'demo nidhi',
  'demo farmbazzar',
  'theme classic',
  'theme amber',
  'theme cyan',
  'clear',
  'ask',
];

export function getAutocompleteSuggestions(partial: string): string[] {
  if (!partial) return [];
  const lower = partial.toLowerCase();
  return COMMAND_LIST.filter((cmd) => cmd.startsWith(lower)).slice(0, 6);
}
