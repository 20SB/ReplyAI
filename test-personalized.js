/**
 * Test personalized reply generation using Subha's profile
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_KEY_HERE';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Subha's profile
const subhaProfile = {
  name: 'Subha Biswal',
  profession: 'Full Stack Software Developer',
  location: 'Gurgaon, India',
  currentRole: 'Senior Software Developer',
  currentCompany: 'ShelfEx',
  experience: '2+ years',
  bio: `Full Stack Software Developer with 2+ years at ShelfEx and Wasserstoff. 
Expertise in JavaScript/TypeScript, React.js, Next.js, Node.js, PostgreSQL, MongoDB, Docker, and cloud (AWS, GCP). 
Built AI-powered platforms, microservices, and enterprise apps. Strong in system design, database optimization, and performance.`,
  communicationStyle: 'mixed', // Professional but approachable
  tonePreferences: {
    formality: 'casual',
    humor: true,
    emojis: 'minimal',
    responseLength: 'short',
  },
  personalityTraits: [
    'Technical and detail-oriented',
    'Results-focused',
    'Direct communicator',
    'Problem solver',
  ],
  commonPhrases: [
    'Let me check',
    'Sure thing',
    'Got it',
    'Working on it',
    'Will update you',
    'Sounds good',
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React.js',
    'Next.js',
    'Node.js',
    'PostgreSQL',
    'Docker',
    'GCP',
  ],
};

async function testPersonalizedReply(message, scenario, tone = null) {
  console.log('\n' + '='.repeat(70));
  console.log(`\n📩 ${scenario}`);
  console.log(`Message: "${message}"`);
  if (tone) console.log(`Tone: ${tone}`);
  console.log('\n' + '-'.repeat(70));

  let prompt = `You are replying AS Subha Biswal, not generating generic options. 
This must sound EXACTLY like Subha wrote it, based on their profile below.\n\n`;

  prompt += `**WHO YOU ARE (Subha Biswal):**
- Profession: ${subhaProfile.profession}
- Current Role: ${subhaProfile.currentRole} at ${subhaProfile.currentCompany}
- Experience: ${subhaProfile.experience}
- Location: ${subhaProfile.location}

**Background:**
${subhaProfile.bio}

**Your Communication Style:** ${subhaProfile.communicationStyle}

**Tone Preferences:**
- Formality: ${subhaProfile.tonePreferences.formality}
- Humor: ${subhaProfile.tonePreferences.humor ? 'Yes, when appropriate' : 'Keep professional'}
- Emojis: ${subhaProfile.tonePreferences.emojis}
- Reply Length: ${subhaProfile.tonePreferences.responseLength}

**Personality Traits:**
${subhaProfile.personalityTraits.map(t => `- ${t}`).join('\n')}

**Phrases you commonly use:**
${subhaProfile.commonPhrases.join(', ')}

**Technical Skills:** ${subhaProfile.skills.join(', ')}

**MESSAGE TO REPLY TO:**
"${message}"

`;

  if (tone) {
    const toneMap = {
      professional: 'more formal and business-appropriate than usual',
      short: 'very brief (5-15 words max)',
      friendly: 'extra warm and approachable',
    };
    prompt += `**IMPORTANT:** Make this reply ${toneMap[tone]}.\n\n`;
  }

  prompt += `**YOUR TASK:**
Generate 3 DIFFERENT reply options that Subha would actually write.

CRITICAL RULES:
1. Write AS Subha, not as a generic assistant
2. Match Subha's communication style, personality, and tone
3. Sound natural and authentic - like Subha is typing this
4. Each reply should be distinctly different
5. Use phrases Subha would actually use
6. Be conversational and human

Format as numbered list:
1. [first reply]
2. [second reply]
3. [third reply]

Only provide the replies, no explanations.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

async function runTests() {
  console.log('🤖 ReplyAI - Personalized Replies (AS Subha Biswal)\n');

  await testPersonalizedReply(
    "Hey, are you free for coffee tomorrow afternoon?",
    "SCENARIO 1: Coffee Invitation (Casual)"
  );

  await testPersonalizedReply(
    "Can you help me with a React optimization issue? App is getting slow with large datasets.",
    "SCENARIO 2: Technical Help Request"
  );

  await testPersonalizedReply(
    "What do you think about migrating our backend to microservices?",
    "SCENARIO 3: Technical Discussion"
  );

  await testPersonalizedReply(
    "Could you review the PR I just submitted? Need it merged by EOD.",
    "SCENARIO 4: Work Request",
    "short"
  );

  await testPersonalizedReply(
    "We need someone to lead the database optimization project. Interested?",
    "SCENARIO 5: Job/Project Offer",
    "professional"
  );

  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Test complete! These replies sound like Subha, not generic bot responses.\n');
}

runTests().catch(console.error);
