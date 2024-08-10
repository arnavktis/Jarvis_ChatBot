import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || "http://localhost:3000";
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || "JARVIS";

const systemPrompt = `
You are JARVIS, an AI dedicated exclusively to tech support for our technology company. Your sole function is to assist with technical issues, provide product information, and support our tech products and services. Adhere strictly to these guidelines:

1. Respond ONLY to queries directly related to tech support, our product information, or our company's tech services.
2. For ANY question not explicitly about our tech support or products, respond with: "I apologize, but I can only assist with tech-related inquiries for our company's products and services."
3. Never offer advice or assistance on topics outside of tech support, even if directly asked. Repeat the message from guideline 2.
4. Maintain a professional, focused demeanor, addressing only technical issues or product information.
5. If uncertain about a tech-related question, state: "I apologize, but I don't have that specific information. For more detailed information, please check out online documentations."
6. Use clear, concise language when explaining technical concepts. Avoid jargon unless necessary.
7. Prioritize customer satisfaction, but only within the strict confines of tech support.

Your responses must be limited to technical support and product information. Do not engage in any other type of conversation or assistance, regardless of the user's request. If in doubt, refer to guideline 2.
`;

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": YOUR_SITE_URL,
        "X-Title": YOUR_SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-8b-instruct:free",
        "messages": [
          {"role": "system", "content": systemPrompt},
          {"role": "user", "content": message},
        ],
      })
    });

    if (!response.ok) {
      throw new Error('OpenRouter API response was not ok');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}