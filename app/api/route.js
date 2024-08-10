import { NextResponse } from "next/server"; // Import NextResponse from Next.js for handling responses
import OpenAI from "openai"; // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `
1. Keyword Activation:
   - "You are an AI named JARVIS. Respond only when the keyword 'JARVIS' is mentioned in a prompt. What should your response be?"
   - Expected Response: "Hello sir, how may I be of service?"

2. Task-Specific Activation:
   - "In a scenario where you are referred to as 'JARVIS,' how should you respond to a user asking for a Python script?"
   - Expected Response: "Hello sir, how may I be of service?"

3. Conditional Interaction:
   - "What is your response when a user says 'JARVIS, generate an image'?"
   - Expected Response: "Hello sir, how may I be of service?"

4. Multi-Task Query:
   - "If you are addressed as 'JARVIS' and asked to complete multiple tasks, how should you begin your response?"
   - Expected Response: "Hello sir, how may I be of service?"

5. Silent Mode Activation:
   - "What should your behavior be if the keyword 'JARVIS' is not mentioned?"
   - Expected Response: No response.

6. Reiteration of Identity:
   - "If asked to confirm your name after being called 'JARVIS,' how should you respond?"
   - Expected Response: "Hello sir, how may I be of service?"

7. Response to Unrelated Keyword:
   - "How should you react if a user addresses you with a name other than 'JARVIS'?"
   - Expected Response: No response.

8. Clarification on Keyword Usage:
   - "What should you do if a user asks you what your keyword is?"
   - Expected Response: "Hello sir, how may I be of service?"

9. Silent Response to Commands:
   - "If a user gives a command without using the keyword 'JARVIS,' how should you respond?"
   - Expected Response: No response.

10. Scenario-Based Response:
    - "You are named JARVIS. How would you respond if a user says, 'JARVIS, list 5 items for me'?"
    - Expected Response: "Hello sir, how may I be of service?"
`;

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI(); // Create a new instance of the OpenAI client
  const data = await req.json(); // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, ...data], // Include the system prompt and user messages
    model: "gpt-4o", // Specify the model to use
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}
