// ============================================================
// PROJECTS DATA
// ============================================================

export interface Project {
  id: string;
  name: string;
  fullName: string;
  description: string;
  tech: string[];
  githubUrl: string;
  demoUrl?: string;
  flagship?: boolean;
  capabilities: string[];
  highlights: string[];
  status: 'completed' | 'active' | 'in-progress';
}

export const PROJECTS: Record<string, Project> = {
  aegis: {
    id: 'aegis',
    name: 'AEGIS',
    fullName: 'AEGIS \u2013 AI Agent Reliability & Engineering Platform',
    description: 'A backend-focused AI reliability platform designed to monitor AI agent workflows, execution traces, failures and performance metrics.',
    tech: ['Python', 'FastAPI', 'REST APIs', 'SQLite', 'Next.js', 'React'],
    githubUrl: 'https://github.com/3407Naveen/AGES',
    flagship: true,
    status: 'active',
    capabilities: [
      'Trace management',
      'Event analysis',
      'Trace replay',
      'System diagnostics',
      'Trace comparison',
      'Regression test generation',
      'Regression test execution',
      'Heuristic-based response evaluation',
      'Regex-based prompt injection detection',
      'Simulated fault injection',
      'Optimization recommendations',
      'Release assessment',
    ],
    highlights: [
      'Backend architecture for AI workflow reliability',
      'Comprehensive observability and testing framework',
      'Engineering depth in AI agent monitoring',
      'REST API design for trace and event management',
    ],
  },
  buildvisor: {
    id: 'buildvisor',
    name: 'BuildVisor',
    fullName: 'BuildVisor \u2013 AI-Powered 3D Home Builder',
    description: 'An AI-assisted home design platform that converts user prompts into 3D house design concepts.',
    tech: ['Next.js', 'React', 'AI Integration', '3D Visualization'],
    githubUrl: 'https://github.com/3407Naveen/BuildVisor',
    status: 'completed',
    capabilities: [
      'AI-assisted home design',
      'Interactive 3D visualization',
      '3D house design concepts',
      '5D construction cost planning concept',
      'Interactive application workflows',
    ],
    highlights: [
      'Converts natural language prompts into 3D designs',
      'Interactive visualization system',
      'AI-driven design generation',
    ],
  },
  'bharat-bazar': {
    id: 'bharat-bazar',
    name: 'Bharat Bazar',
    fullName: 'Bharat Bazar \u2013 Voice-First E-commerce Platform',
    description: 'A voice-enabled e-commerce platform designed to simplify product discovery and product listing.',
    tech: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'Firebase', 'OpenAI Whisper'],
    githubUrl: '', // Repository link pending confirmation (not yet public on GitHub)
    demoUrl: 'https://bharat-bazzar.vercel.app/',
    status: 'completed',
    capabilities: [
      'Voice-based product listing',
      'Speech-to-text using OpenAI Whisper',
      'Backend REST APIs',
      'Database integration',
      'Payment integration work',
      'QR-based product sharing',
    ],
    highlights: [
      'Voice-first commerce for accessibility',
      'Multi-language speech recognition',
      'Full-stack e-commerce architecture',
    ],
  },
  nidhi: {
    id: 'nidhi',
    name: 'NIDHI.AI',
    fullName: 'NIDHI.AI \u2013 AI-Powered Personal Finance Platform',
    description: 'A personal finance management platform with expense tracking, budget management, financial dashboards and transaction management.',
    tech: ['React.js', 'Next.js', 'Python', 'FastAPI', 'Supabase'],
    githubUrl: 'https://github.com/3407Naveen/Nidhi.Ai',
    demoUrl: 'https://chipper-cassata-56dbc0.netlify.app/login',
    status: 'completed',
    capabilities: [
      'Expense tracking',
      'Budget management',
      'Financial dashboards',
      'Transaction management',
      'FastAPI backend integration',
      'Supabase data management',
      'AI-assisted financial insight features',
    ],
    highlights: [
      'Full-stack finance application',
      'AI-powered financial insights',
      'Real-time dashboard analytics',
    ],
  },
  farmbazzar: {
    id: 'farmbazzar',
    name: 'FarmBazzarAI',
    fullName: 'FarmBazzarAI \u2013 Digital Platform for Indian Farmers',
    description: 'An innovative digital platform for Indian farmers providing AI-driven crop price predictions, a virtual marketplace and insurance claim management.',
    tech: ['Next.js', 'Tailwind CSS', 'Node.js'],
    githubUrl: 'https://github.com/3407Naveen/FarmBazzarAI',
    demoUrl: 'https://farmbazzarai.web.app/',
    status: 'completed',
    capabilities: [
      'AI-driven crop price predictions',
      'Virtual marketplace for farmers',
      'Insurance claim management',
      'Multilingual chatbot support',
    ],
    highlights: [
      'Agricultural technology for Indian farmers',
      'AI-powered price prediction system',
      'Digital marketplace ecosystem',
    ],
  },
};
