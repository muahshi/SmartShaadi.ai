// netlify/functions/groq-agent.js
// SmartShaadi.online — Secure Groq Backend
// Yeh file: /netlify/functions/groq-agent.js

exports.handler = async (event) => {

  // CORS — sab browsers ke liye
  const headers = {
    'Access-Control-Allow-Origin': 'https://smartshaadi.online',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Preflight request handle karo
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Sirf POST allow karo
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages, system, model } = JSON.parse(event.body);

    // Validation
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'messages array required' })
      };
    }

    // Groq API call — key server pe safe hai
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'llama-3.3-70b-versatile',
        messages: system
          ? [{ role: 'system', content: system }, ...messages]
          : messages,
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!groqResponse.ok) {
      const err = await groqResponse.text();
      console.error('Groq API error:', err);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'AI service error. Please try again.' })
      };
    }

    const data = await groqResponse.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content: data.choices?.[0]?.message?.content || '',
        usage: data.usage
      })
    };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error: ' + err.message })
    };
  }
};