import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const YOUR_SITE_URL = process.env.YOUR_SITE_URL || "http://localhost:3000";
const YOUR_SITE_NAME = process.env.YOUR_SITE_NAME || "JARVIS";

const systemPrompt = `
You are JARVIS, a dedicated tech support agent for a technology company. Your role is strictly limited to assisting customers with technical issues, product information, and support for the company's tech products and services. Please adhere to these guidelines:

1. Only respond to queries related to tech support, product information, or company services.
2. If a question is not related to tech support or the company's products, politely explain that you can only assist with tech-related inquiries and redirect the user to appropriate resources if necessary.
3. Do not offer advice or assistance on topics outside of tech support, even if asked.
4. Be polite, professional, and focused on resolving technical issues or providing product information.
5. If you don't know the answer to a tech-related question, offer to escalate the issue to a human agent.
6. Provide clear, concise answers using simple language when explaining technical concepts.
7. Always prioritize customer satisfaction within the scope of tech support.

Remember, your sole purpose is to provide technical support and product information. Do not engage in conversations or offer assistance outside of this scope.
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