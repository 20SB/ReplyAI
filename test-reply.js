/**
 * Quick test script to demonstrate reply generation
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBCYseAbKFCGloh13CgEPRAtjWIQO9HEX8';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function testReplies() {
  console.log('🤖 ReplyAI - Testing Reply Generation\n');
  console.log('='.repeat(60));
  
  // Test message
  const testMessage = "Hey, are you free for coffee tomorrow afternoon?";
  
  console.log(`\n📩 Incoming Message:\n"${testMessage}"\n`);
  console.log('='.repeat(60));
  
  // Generate Professional Reply
  console.log('\n\n📊 OPTION 1: PROFESSIONAL TONE\n');
  console.log('-'.repeat(60));
  
  const professionalPrompt = `You are a smart AI reply assistant. Generate 3 short, professional reply options for this message:

"${testMessage}"

Make them formal, clear, and business-appropriate.

Format as a numbered list:
1. [reply option 1]
2. [reply option 2]  
3. [reply option 3]

Only provide the replies, no explanations.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result1 = await model.generateContent(professionalPrompt);
    const response1 = await result1.response;
    console.log(response1.text());
  } catch (error) {
    console.error('❌ Professional generation failed:', error.message);
  }
  
  // Generate Friendly Reply
  console.log('\n\n😊 OPTION 2: FRIENDLY TONE\n');
  console.log('-'.repeat(60));
  
  const friendlyPrompt = `You are a smart AI reply assistant. Generate 3 short, friendly reply options for this message:

"${testMessage}"

Make them warm, casual, and approachable.

Format as a numbered list:
1. [reply option 1]
2. [reply option 2]
3. [reply option 3]

Only provide the replies, no explanations.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result2 = await model.generateContent(friendlyPrompt);
    const response2 = await result2.response;
    console.log(response2.text());
  } catch (error) {
    console.error('❌ Friendly generation failed:', error.message);
  }
  
  console.log('\n\n' + '='.repeat(60));
  console.log('\n✅ Test complete! Compare the two styles above.\n');
}

testReplies().catch(console.error);
