import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Read the resume content to ground the AI model
const getResumeContext = () => {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'resume.md');
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error reading resume context:', error);
    return 'Context not available. System error.';
  }
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { question, customApiKey, provider = 'grok' } = body;

    if (!question || question.trim() === '') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Determine the API Key: check environment variables first, then custom client-supplied key
    const grokKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY || (provider === 'grok' ? customApiKey : null);
    const openaiKey = process.env.OPENAI_API_KEY || (provider === 'openai' ? customApiKey : null);

    const context = getResumeContext();

    const systemPrompt = `You are the AI Portfolio Copilot for Shubh Shaguneet Singh. You serve two purposes:

PURPOSE 1 — PROFILE QUESTIONS (about Shubh):
If the user asks a question about Shubh (e.g. his projects, experience, skills, education, contact details, personal life, interests, or background):
- If the information is present in the profile data provided below, you MUST answer it accurately using ONLY that data. Rely strictly on the text provided. Do not hallucinate or invent any facts about Shubh. Speak naturally and professionally.
- If the information is NOT present in the profile data (e.g. his favorite food, color, family, or specific details not in the profile text), you MUST respond with EXACTLY this string:
"I don't have that information in Shubh's profile. However, you can reach out directly to Shubh at shubhshaguneet635@gmail.com or call +91 8146049603 to ask him!"

PURPOSE 2 — GENERAL KNOWLEDGE & GREETINGS (not about Shubh's personal profile):
If the user greets you (e.g. "hello", "hi", "hey", "how are you") or asks a general question that is NOT about Shubh's profile details (e.g., "What is machine learning?", "Explain REST APIs", "What is Flutter?", "Tell me a joke", "Write a Python script to reverse a string", "Capital of France"), you MUST answer it helpfully, concisely, and informatively using your general knowledge. If it's a greeting, introduce yourself as Shubh's AI Copilot and offer to help.

HOW TO CLASSIFY:
- If the question mentions "Shubh", "you", "your", "his", "he", "him", or asks about the portfolio owner's details/background → Use PURPOSE 1.
- If the question is a general query, greeting, technical question, or topic unrelated to Shubh → Use PURPOSE 2.

EXAMPLES OF CLASSIFICATION:
- "Hello" / "Hi" / "Who are you?" → General greeting / intro. Answer helpfully using PURPOSE 2 (introduce yourself as Shubh's AI Copilot).
- "What is React?" / "Explain Docker" → General query. Answer using PURPOSE 2.
- "Where did Shubh go to college?" → About Shubh's education. This is in the profile. Answer using PURPOSE 1.
- "What is Shubh's favorite video game?" → About Shubh, but NOT in the profile. Respond with EXACTLY the fallback redirect string.
- "Do you know Python?" → About Shubh's skills. This is in the profile. Answer using PURPOSE 1.
- "How does a database transaction work?" → General query. Answer using PURPOSE 2.

SHUBH'S PROFILE DATA:
${context}
`;

    let answerText = '';

    if (provider === 'grok') {
      if (!grokKey) {
        return NextResponse.json(
          { error: 'Grok API Key is missing. Please configure GROK_API_KEY in .env.local or enter it in the chat settings.' },
          { status: 400 }
        );
      }

      // xAI API is fully compatible with OpenAI SDK. We configure base URL and model.
      const client = new OpenAI({
        apiKey: grokKey,
        baseURL: 'https://api.x.ai/v1',
      });
      
      const response = await client.chat.completions.create({
        model: 'grok-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.1,
        max_tokens: 500,
      });
      
      answerText = response.choices[0].message.content;
    } else if (provider === 'openai') {
      if (!openaiKey) {
        return NextResponse.json(
          { error: 'OpenAI API Key is missing. Please configure OPENAI_API_KEY in .env.local or enter it in the chat settings.' },
          { status: 400 }
        );
      }

      const openai = new OpenAI({ apiKey: openaiKey });
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.1,
        max_tokens: 500,
      });

      answerText = response.choices[0].message.content;
    } else {
      return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
    }

    return NextResponse.json({ answer: answerText.trim() });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
