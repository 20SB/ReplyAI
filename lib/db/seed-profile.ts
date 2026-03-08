/**
 * Seed Subha's profile from resume
 */

export const subhaProfile = {
  userId: 'default_user',
  
  // Basic Info
  name: 'Subha Biswal',
  age: null, // Not specified in resume
  location: 'Gurgaon, India',
  profession: 'Full Stack Software Developer',
  
  // Professional Background
  currentRole: 'Senior Software Developer',
  currentCompany: 'ShelfEx',
  experience: '2+ years',
  skills: [
    'JavaScript',
    'TypeScript',
    'React.js',
    'Next.js',
    'Node.js',
    'Express.js',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'GCP',
    'AWS',
    'Microservices',
    'REST API',
    'GraphQL',
  ],
  expertise: [
    'Full Stack Development',
    'System Design',
    'Database Optimization',
    'CI/CD',
    'Test Automation',
    'Cloud Architecture',
    'Performance Optimization',
  ],
  
  // Communication Style (inferred from resume tone)
  communicationStyle: 'mixed', // Professional but approachable
  tonePreferences: {
    formality: 'casual', // Direct and clear, not overly formal
    humor: true, // Can be light when appropriate
    emojis: 'minimal', // Professional context
    responseLength: 'short', // Concise and to the point
  },
  
  // Personal traits (inferred)
  commonPhrases: [
    'Let me check',
    'Sure thing',
    'Got it',
    'Working on it',
    'Will update you',
    'Sounds good',
  ],
  interests: [
    'Web Development',
    'AI/ML',
    'System Design',
    'DevOps',
    'Performance Optimization',
  ],
  values: [
    'Results-driven',
    'Technical excellence',
    'Clear communication',
    'Continuous learning',
  ],
  
  // Bio (condensed version)
  bio: `Full Stack Software Developer with 2+ years of professional experience at ShelfEx and Wasserstoff. 
Expertise in JavaScript/TypeScript, React.js, Next.js, Node.js, PostgreSQL, MongoDB, Docker, and cloud technologies (AWS, GCP). 
Built AI-powered platforms, microservices, and enterprise applications. 
Strong focus on system design, database optimization, test automation, and performance engineering.
Based in Gurgaon, India.`,
  
  personalityTraits: [
    'Technical and detail-oriented',
    'Results-focused with metrics',
    'Direct communicator',
    'Problem solver',
    'Team player',
    'Continuous learner',
  ],
  
  replyExamples: [], // Will be populated as user provides feedback
}
