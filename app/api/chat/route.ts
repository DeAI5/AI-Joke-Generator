export const runtime = "edge";

// Add type definition for process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VENICE_API_KEY: string;
    }
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VENICE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-31-24b',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that specializes in generating jokes. You should respond with a single joke that is clean, family-friendly, and appropriate for all ages. Your jokes should be clever and witty, avoiding any offensive content. Each response should contain exactly one joke with its punchline.'
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 150,
      stream: false
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Venice API error response:', errorData);
    throw new Error(`Venice API request failed with status ${response.status}: ${errorData}`);
  }

  const data = await response.json();
  return new Response(JSON.stringify(data.choices[0].message), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}