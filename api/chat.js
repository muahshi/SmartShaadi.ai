export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { messages, max_tokens, system } = req.body;

    // Force JSON-only output via system message
    const sysContent = (system || '') +
      '\n\nCRITICAL: Respond with ONLY valid JSON. No markdown, no backticks, no extra text. Start with { end with }.';

    const groqMessages = [
      { role: 'system', content: sysContent },
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: max_tokens || 2000,
        messages: groqMessages,
        temperature: 0.4,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();

    // Return in Anthropic-compatible format so agents work without changes
    return res.status(200).json({
      content: [{ type: 'text', text: data.choices?.[0]?.message?.content || '' }]
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
