// /api/groq-agent.js
export default async function handler(req, res) {
  // Check if it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, messages } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, // API Key secure rakho
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: system }, ...messages]
      })
    });

    const data = await response.json();
    res.status(200).json({ content: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
}

