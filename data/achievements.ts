// ============================================================
// ACHIEVEMENTS, EDUCATION & CERTIFICATIONS DATA
// ============================================================

export interface Achievement {
  icon: string;
  title: string;
  detail: string;
  year?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    icon: '\ud83c\udfc6',
    title: 'VISA 24 Hours AI Hackathon',
    detail: 'Shaastra, IIT Madras \u2013 Reached the Capture The Flag final round',
    year: '2025',
  },
  {
    icon: '\ud83e\udd48',
    title: 'CampusX Pitchathon 2.0',
    detail: 'SRM Ramapuram \u2013 Second Place with team',
    year: '2025',
  },
  {
    icon: '\ud83d\udcdd',
    title: 'NCAAIET\'25 Research Paper',
    detail: 'Sri Sairam \u2013 Presented \"AI-Powered Predictive Healthcare: Disease Detection using Machine Learning and Medical Imaging\"',
    year: '2025',
  },
  {
    icon: '\ud83c\udfc5',
    title: 'National Librarian\'s Day 2025',
    detail: 'Third Prize in Speech Competition',
    year: '2025',
  },
  {
    icon: '\ud83d\ude80',
    title: '20+ Hackathons',
    detail: 'Participated in hackathons focused on software development, AI and emerging technologies',
  },
  {
    icon: '\ud83d\udee0\ufe0f',
    title: '36-Hour Hackathon',
    detail: 'Organized and contributed to technical events and innovation activities',
  },
];

export interface Education {
  degree: string;
  institution: string;
  duration: string;
  score: string;
  level: 'undergraduate' | 'higher-secondary';
}

export const EDUCATION: Education[] = [
  {
    degree: 'B.Tech \u2013 Artificial Intelligence & Data Science',
    institution: 'New Prince Shri Bhavani College of Engineering and Technology, Chennai',
    duration: '2024\u20132028',
    score: 'CGPA: 7.35/10',
    level: 'undergraduate',
  },
  {
    degree: 'Higher Secondary',
    institution: 'New Prince Higher Secondary School',
    duration: '2022\u20132024',
    score: '78%',
    level: 'higher-secondary',
  },
];

export interface Certification {
  name: string;
  issuer: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'IoT with Machine Learning',
    issuer: 'Pantech E-Learning',
  },
  {
    name: 'AWS Cloud Fundamentals',
    issuer: 'Pantech E-Learning',
  },
];

export interface CurrentlyBuilding {
  name: string;
  description: string;
  status: 'active' | 'planning' | 'concept';
}

export const CURRENTLY_BUILDING: CurrentlyBuilding[] = [
  {
    name: 'AEGIS',
    description: 'AI Agent Reliability and Engineering Platform',
    status: 'active',
  },
  {
    name: 'Markathon 2026',
    description: 'Startup Go-to-Market Challenge',
    status: 'planning',
  },
  {
    name: 'Fundamentals',
    description: 'Digital Growth and Technology Agency',
    status: 'concept',
  },
  {
    name: 'Stitch24',
    description: '24-hour Tailoring Service Concept',
    status: 'concept',
  },
  {
    name: 'CampusX',
    description: 'Student Startup Ecosystem',
    status: 'active',
  },
];
