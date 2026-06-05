import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
    const { question, customApiKey, provider = 'gemini' } = body;

    if (!question || question.trim() === '') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Determine the API Key: check environment variables first, then custom client-supplied key
    const geminiKey = process.env.GEMINI_API_KEY || (provider === 'gemini' ? customApiKey : null);
    const openaiKey = process.env.OPENAI_API_KEY || (provider === 'openai' ? customApiKey : null);

    const context = getResumeContext();

    const systemPrompt = `You are the AI Portfolio Copilot for Shubh Shaguneet Singh. 
Your core objective is to answer questions about Shubh's projects, experience, skills, and academic background.

CRITICAL RULES FOR RESPONDING:
1. Grounding: You must ONLY answer using the provided profile data below. Do NOT use outside knowledge or hallucinate details.
2. Facts only: Rely strictly on the text provided. Do not assume or extrapolate details.
3. Handling unknown questions: If a question cannot be answered using the provided profile data (e.g., questions about personal preferences, unmentioned projects, or unrelated topics), you MUST respond EXACTLY with a variant of:
   "I don't have that information in Shubh's profile. However, you can reach out directly to Shubh at shubhshaguneet635@gmail.com or call +91 8146049603 to ask him!"
4. Contextual Guidance: Keep your answers concise, professional, and positive. Avoid mentioning that you are reading from a text file or markdown context. Speak naturally.

SHUBH'S PROFILE DATA:
${context}
`;

    let answerText = '';

    if (provider === 'gemini') {
      if (!geminiKey) {
        return NextResponse.json(
          { error: 'Gemini API Key is missing. Please configure GEMINI_API_KEY in .env.local or enter it in the chat settings.' },
          { status: 400 }
        );
      }

      const ai = new GoogleGenerativeAI(geminiKey);
      // Using gemini-1.5-flash which is standard and has very low latency
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `${systemPrompt}\n\nUser Question: ${question}\n\nAssistant Response:`;
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // low temperature for strict grounding
          maxOutputTokens: 500,
        }
      });
      
      answerText = result.response.text();
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
