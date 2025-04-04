export const runtime = "edge";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VENICE_API_KEY: string;
    }
  }
}

export async function GET() {
  try {
    // Try a simple chat completion request
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
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Tell me a short joke.'
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Venice API error response:', errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    return Response.json({ success: true, response: data });
  } catch (error) {
    console.error('Error testing Venice API:', error);
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 