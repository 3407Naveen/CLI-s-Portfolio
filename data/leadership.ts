// ============================================================
// LEADERSHIP & STRATEGIC INITIATIVES DATA
// ============================================================

export interface Initiative {
  id: string;
  name: string;
  position: string;
  tagline?: string;
  description: string;
  highlights: string[];
  achievements?: string[];
  website?: string;
  registrationUrl?: string;
  status: 'active' | 'ongoing' | 'concept' | 'early-stage';
}

export const INITIATIVES: Record<string, Initiative> = {
  campusx: {
    id: 'campusx',
    name: 'CampusX',
    position: 'Chennai Region Head',
    description: 'A student entrepreneurship and startup ecosystem initiative focused on connecting student founders, aspiring entrepreneurs, mentors and institutions.',
    status: 'active',
    website: 'https://campusx.club',
    highlights: [
      'Building a student startup ecosystem',
      'Supporting founder networking',
      'Coordinating student communities',
      'Organizing startup meetups',
      'Supporting pitch events',
      'Developing institutional partnerships',
      'Promoting entrepreneurial opportunities',
    ],
    achievements: [
      'Organized FIRST Startup Meetup',
      'CampusX Pitchathon 2.0 at SRM Ramapuram',
      'Second Place with team at Pitchathon 2.0',
      'Events involving 100+ participants and 10+ mentors',
    ],
  },
  markathon: {
    id: 'markathon',
    name: 'Markathon 2026',
    position: 'CampusX Strategic Initiative',
    tagline: 'Where Startups Meet the Market',
    description: '12-HOUR GO-TO-MARKET CHALLENGE \u2013 A startup-focused challenge designed to help idea-stage, prototype-stage and early-stage startups work on actual go-to-market execution.',
    status: 'ongoing',
    registrationUrl: 'https://forms.gle/2Vn3zmunTQ1wsFxE8',
    highlights: [
      'Product positioning',
      'Go-to-market strategy',
      'Customer acquisition',
      'Marketing strategy',
      'Customer validation',
      'First sales and revenue generation',
    ],
    achievements: [
      'Online preliminary registrations open',
      'Top 50 teams targeted for grand finale',
      'Grand finale planned for January 2027 in Chennai',
      'Mini Marketathon initiatives in progress',
      'Institutional partnerships established',
    ],
  },
  'zero-ai': {
    id: 'zero-ai',
    name: 'Zero AI Solutions',
    position: 'Co-Founder',
    description: 'An early-stage technology initiative focused on web development, AI-powered solutions and practical technology applications.',
    status: 'early-stage',
    highlights: [
      'Early-stage product concepts',
      'AI-powered solution development',
      'Web development initiatives',
      'Technology planning',
      'Collaborative execution',
    ],
  },
  aavishkar: {
    id: 'aavishkar',
    name: 'Aavishkar Club',
    position: 'President \u2013 AI & Data Science Department, NPSBCET',
    description: 'Technical club leading student initiatives in AI, programming and innovation at the department level.',
    status: 'active',
    highlights: [
      'Leading student technical initiatives',
      'Coordinating committee members',
      'Planning technical events',
      'Encouraging programming and AI learning',
      'Supporting hackathons and innovation activities',
      'Organizing technical sessions and collaborative development',
    ],
  },
  fundamentals: {
    id: 'fundamentals',
    name: 'Fundamentals / FNMNTLS',
    position: 'Founder-led Agency Initiative',
    tagline: 'Make your Brand Impossible to Ignore',
    description: 'A digital growth and technology agency initiative focused on helping businesses strengthen their digital presence, build platforms and improve customer reach.',
    status: 'early-stage',
    highlights: [
      'Digital Marketing',
      'Social Media Marketing',
      'E-commerce Website Development',
      'Strategic Branding',
      'Influencer Marketing',
      'Personal Branding',
      'Website Development',
      'CRM Development',
      'Lead Generation',
    ],
  },
  stitch24: {
    id: 'stitch24',
    name: 'Stitch24',
    position: 'Founder',
    description: 'A startup concept focused on 24-hour tailoring, clothing stitching and alteration services.',
    status: 'concept',
    highlights: [
      'Making tailoring and clothing alterations more convenient',
      '24-hour service-oriented model',
      'Venture concept and product initiative',
    ],
  },
};
