/**
 * Test diverse reply generation with improved prompts
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_KEY_HERE';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function testMessage(message, scenario) {
  console.log('\n' + '='.repeat(70));
  console.log(`\n📩 ${scenario}`);
  console.log(`Message: "${message}"\n`);
  console.log('-'.repeat(70));
  
  const improvedPrompt = `You are helping someone reply to this message. Generate 3 DIFFERENT, NATURAL replies.

Message: "${message}"

IMPORTANT:
- Each reply should sound like a real person texting, not a robot
- Vary the length, style, and approach across the 3 options
- Use natural language, contractions, and casual phrasing
- Some replies can be short (5-10 words), others longer
- Don't use formal phrases like "Thank you for", "I appreciate", "Kindly"
- Add personality - be conversational, not corporate

Generate 3 distinct reply options:
1. [first reply]
2. [second reply]
3. [third reply]`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(improvedPrompt);
    const response = await result.response;
    console.log(response.text());
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

async function runTests() {
  console.log('🤖 ReplyAI - Testing Reply Diversity\n');
  
  await testMessage(
    "Hey, are you free for coffee tomorrow afternoon?",
    "SCENARIO 1: Coffee Invitation"
  );
  
  await testMessage(
    "Did you finish that report I asked for?",
    "SCENARIO 2: Work Follow-up"
  );
  
  await testMessage(
    "OMG you won't believe what just happened! 😱",
    "SCENARIO 3: Exciting News"
  );
  
  await testMessage(
    "Thanks for helping me out yesterday, really appreciate it",
    "SCENARIO 4: Thank You Message"
  );
  
  await testMessage(
    "Can you send me the presentation slides from last week's meeting?",
    "SCENARIO 5: Document Request"
  );
  
  console.log('\n' + '='.repeat(70));
  console.log('\n✅ Test complete! Check if replies are diverse and natural.\n');
}

runTests().catch(console.error);
