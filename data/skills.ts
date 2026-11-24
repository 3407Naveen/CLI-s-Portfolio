// ============================================================
// SKILLS DATA — Categorized technical competencies
// ============================================================

export interface SkillCategory {
  name: string;
  items: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'PROGRAMMING',
    items: ['Python', 'JavaScript', 'C', 'SQL'],
  },
  {
    name: 'FRONTEND',
    items: [
      'React.js',
      'Next.js',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'shadcn/ui',
      'Framer Motion',
    ],
  },
  {
    name: 'BACKEND',
    items: [
      'Node.js',
      'Express.js',
      'FastAPI',
      'REST API Development',
      'JWT Authentication',
      'Pydantic',
    ],
  },
  {
    name: 'DATABASES',
    items: ['MySQL', 'PostgreSQL', 'MongoDB', 'Supabase', 'Firebase', 'SQLite'],
  },
  {
    name: 'AI & GENERATIVE AI',
    items: [
      'Gemini API',
      'LLM Integration',
      'Prompt Engineering',
      'Machine Learning',
      'Scikit-learn',
      'OpenAI Whisper',
    ],
  },
  {
    name: 'CLOUD & DEVOPS',
    items: ['AWS', 'Docker', 'Vercel', 'Git', 'GitHub'],
  },
  {
    name: 'DEVELOPER TOOLS',
    items: ['VS Code', 'Postman', 'FastAPI Swagger UI', 'n8n', 'Figma'],
  },
  {
    name: 'CORE CS',
    items: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'Systems & Debugging',
    ],
  },
];
