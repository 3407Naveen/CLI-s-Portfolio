// ============================================================
// EXPERIENCE DATA — Professional work history
// ============================================================

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  startDate: string; // for sorting
  highlights: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'altruisty',
    company: 'Altruisty Innovation Pvt. Ltd.',
    position: 'Generative AI Intern',
    duration: 'September 2026 – October 2026',
    startDate: '2026-09',
    highlights: [
      'Developed a Gemini API-powered AI chatbot with conversation history management',
      'Worked on prompt engineering, loading indicators and chat reset functionality',
      'Integrated Gemini API securely using environment variables',
      'Built a Generative AI Text Analyzer using Python, FastAPI and Gemini API',
      'Developed a POST /analyze endpoint for text analysis',
      'Implemented text summaries, sentiment classification, keyword extraction and content difficulty levels',
      'Added Pydantic validation and comprehensive API error handling',
      'Tested APIs through FastAPI Swagger UI and Postman',
    ],
  },
  {
    id: 'viskamnix',
    company: 'VISKAMNIX Technology',
    position: 'Frontend Developer Intern',
    duration: 'June 2025 – July 2025',
    startDate: '2025-06',
    highlights: [
      'Developed responsive e-commerce interfaces using React.js and Tailwind CSS',
      'Integrated an AI-powered chatbot into the application',
      'Worked with reusable components and frontend workflows',
      'Used Git and GitHub for version control',
      'Deployed application updates through Vercel',
    ],
  },
  {
    id: 'ediglobe',
    company: 'EdiGlobe',
    position: 'AI Engineer Intern',
    duration: 'May 2025 – July 2025',
    startDate: '2025-05',
    highlights: [
      'Worked on a machine learning-based employee attrition prediction project',
      'Used Python and Scikit-learn for model development',
      'Performed data preparation and feature processing',
      'Assisted in predictive model development and evaluation',
      'Documented model outputs and project findings',
    ],
  },
];
