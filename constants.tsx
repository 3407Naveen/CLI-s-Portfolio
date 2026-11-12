
import { Project, Skill } from './types';

export const ASCII_HEADER = `
  _   _                                  ____  
 | \\ | | __ ___   _____  ___ _ __     / ___| 
 |  \\| |/ _\` \\ \\ / / _ \\/ _ \\ '_ \\    \\___ \\ 
 | |\\  | (_| |\\ V /  __/  __/ | | |    ___) |
 |_| \\_|\\__,_| \\_/ \\___|\\___|_| |_|   |____/ 
                                             
  SDE & AI Engineer
`;

export const ASCII_SKILLS = `
   _____ _    _ _ _     
  / ____| |  (_) | |    
 | (___ | | ___| | |___ 
  \\___ \\| |/ / | | / __|
  ____) |   <| | | \\__ \\
  ____) |   <| | | \\__ \\
 |_____/|_|\\_\\_|_|_|___/
`;

export const PROJECTS: Record<string, Project> = {
  'bharat-bazar': {
    id: 'bharat-bazar',
    name: "Bharat Bazar'25",
    description: 'An AI-powered, voice-first, mobile-friendly web app helping rural vendors create product listings using voice in Hindi, Tamil, and English.',
    tech: ['React', 'OpenAI Whisper API', 'PWA', 'Node.js'],
    githubUrl: 'github.com/3407Naveen',
    demoUrl: 'https://bharat-bazzar.vercel.app/',
    stats: { stars: 24, forks: 5 },
    codeSnippet: `// Audio Transcription Handler
const handleAudioUpload = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', audioBlob);
  formData.append('model', 'whisper-1');
  
  const response = await openai.createTranscription(formData);
  return extractProductDetails(response.data.text);
}`,
    performance: 'Offline access via PWA. Real-time transcription and auto-categorization of products.',
    reviews: ['"Empowering tool for rural commerce."', '"Excellent use of voice technology for accessibility."']
  },
  'farm-bazzar': {
    id: 'farm-bazzar',
    name: "FarmBazzarAI'25",
    description: 'Innovative digital platform for Indian farmers providing AI-driven crop price predictions, virtual marketplace, and insurance claim management.',
    tech: ['Next.js', 'Tailwind', 'Node.js', 'PostgreSQL', 'Supabase'],
    githubUrl: 'github.com/3407Naveen',
    demoUrl: 'https://farmbazzarai.web.app/',
    stats: { stars: 18, forks: 8 },
    codeSnippet: `// Crop Price Prediction Service
export async function predictPrice(crop, region, date) {
  const historicalData = await db.prices.find({ crop, region });
  const prediction = mlModel.predict(historicalData, date);
  return { estimatedPrice: prediction, confidence: 0.89 };
}`,
    performance: 'Developed during HackAura 2025. Features multilingual chatbots and secure payments.',
    reviews: ['"Great initiative for sustainable farming."', '"The tri-color design represents unity well."']
  },
  'nidhi-ai': {
    id: 'nidhi-ai',
    name: "NIDHI.AI'25",
    description: 'Playful, AI-powered finance dashboard for personal expense tracking. Features an AI assistant named Fin for advice and gamified budget streaks.',
    tech: ['React', 'FastAPI', 'Tailwind', 'Motion Design'],
    githubUrl: 'github.com/3407Naveen',
    demoUrl: 'https://chipper-cassata-56dbc0.netlify.app/login',
    stats: { stars: 32, forks: 12 },
    codeSnippet: `// AI Financial Advisor Interaction
const askFin = async (query) => {
  const context = await getUserFinancialContext();
  const advice = await ai.generateResponse({
    role: 'financial_advisor',
    query: query,
    context: context
  });
  setAnimationState('speaking');
  return advice;
}`,
    performance: 'Created during 24-offline codecraft\'25. Real-time animated insights and receipt scanning.',
    reviews: ['"Making finance fun is a challenge, NIDHI nails it."', '"Love the gamified streaks!"']
  }
};

export const SKILLS: Skill[] = [
  { name: 'React JS', level: 90, description: 'Component-based architecture, Hooks, State Management.', category: 'Language' },
  { name: 'Node JS', level: 85, description: 'Backend API development, Express, authentication.', category: 'Language' },
  { name: 'Python', level: 80, description: 'AI/ML libraries (NumPy, Matplotlib), Data Analysis.', category: 'Language' },
  { name: 'UI/UX Design', level: 85, description: 'Prototyping, User Research, Responsive Design.', category: 'Graphics' },
  { name: 'Project Mgmt', level: 75, description: 'Agile workflows, Team leadership, Hackathon coordination.', category: 'Tool' }
];

export const TIMELINE = [
  { year: 'Sept 2025', title: 'Co-Founder', detail: 'Zero AI Solutions. Started a service-based startup focused on campus life and AI solutions with college friends.' },
  { year: 'Jun 2025', title: 'Front End Developer Intern', detail: 'Viskamnix Technology. Created full-stack web app with AI chatbot. Improved technical and communication skills.' },
  { year: 'May 2025', title: 'AI Intern', detail: 'EdiGlobe. Expanded knowledge in ML, Python libraries (NumPy, Matplotlib) and real-world model implementation.' },
  { year: '2024-28', title: 'B.Tech - AI & DS', detail: 'New Prince Shri Bhavani College of Engineering and Technology. CGPA: 7.5.' }
];

export const HIGHLIGHTS = [
  "🏆 Hackathon Volunteer - inno-hack2k25 (Led web security briefing)",
  "🥈 24-Hour Cyber Security Hackathon - IEEE WIE Student Chapter",
  "🚀 Codecraft'25 Participant - Created NIDHI.AI finance dashboard",
  "⭐ Innovation: Created voice-first commerce for rural India"
];
