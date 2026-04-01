const fs = require('fs');
const path = require('path');
const axios = require('axios'); 

// ─── TOPIC CONFIG ─────────────────────────────────────────────────────────────
const BLOG_TOPICS = [
  {
    slug: 'blog-chennai-wedding-cost-2026',
    title: 'Chennai Wedding Cost 2026 — South Indian Shaadi Ka Complete Budget',
    category: 'City Guide',
    keyFocus: 'Chennai mein 2026 mein wedding ka budget, South Indian traditions, Mylapore vs OMR venues'
  },
  {
    slug: 'blog-ahmedabad-wedding-cost-2026',
    title: 'Ahmedabad Wedding Cost 2026 — Gujarati Shaadi Ka Complete Budget',
    category: 'City Guide',
    keyFocus: 'Ahmedabad mein Gujarati wedding traditions, venue costs, veg catering guide'
  }
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getTodayDate() { return new Date().toISOString().split('T')[0]; }
function getTopicForToday() {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return BLOG_TOPICS[weekNum % BLOG_TOPICS.length];
}

// ─── FULL DELHI TEMPLATE INJECTION ─────────────────────────────────────────────
function wrapInTemplate(topic, bodyContent, date) {
  const canonical = `https://smartshaadi.online/${topic.slug}.html`;
  
  return `<!DOCTYPE html>
<html lang="hi-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title} | Smart Shaadi AI</title>
<meta name="description" content="${topic.keyFocus}">
<link rel="canonical" href="${canonical}">
<link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
<link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
<link href="[https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap](https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap)" rel="stylesheet">
<style>
:root{--gold:#C9A84C;--gold-bg:rgba(201,168,76,0.08);--gold-bd:rgba(201,168,76,0.25);--bg:#0A0800;--card:#111008;--text:#F5EFE0;--muted:#A89070;--r:16px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.75;overflow-x:hidden}
a{color:var(--gold);text-decoration:none}
nav{background:rgba(10,8,0,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;padding:0 1.5rem;border-bottom:1px solid var(--gold-bd);display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--text)}.nav-logo em{color:var(--gold);font-style:italic}
.container{max-width:800px;margin:0 auto;padding:3rem 1.5rem}
.blog-hero{padding-bottom:2.5rem;border-bottom:1px solid var(--gold-bd);margin-bottom:2.5rem}
.blog-cat{display:inline-block;background:var(--gold-bg);border:1px solid var(--gold-bd);color:var(--gold);font-size:.75rem;text-transform:uppercase;padding:.4rem 1.2rem;border-radius:100px;margin-bottom:1.5rem}
h1{font-family:'Cormorant Garamond',serif;font-size:2.8rem;line-height:1.2;margin-bottom:1rem}
.blog-content h2{font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--gold);margin:3rem 0 1rem;border-bottom:1px solid var(--gold-bd);padding-bottom:10px}
.blog-content p{margin-bottom:1.5rem;font-size:1.1rem;color:#D1C8B1}
table{width:100%;border-collapse:collapse;margin:2rem 0;background:var(--card);border-radius:12px;overflow:hidden}
th,td{padding:1.2rem;text-align:left;border:1px solid #1A1810}
th{background:var(--gold-bg);color:var(--gold)}
footer{background:#070600;padding:4rem 2rem;border-top:1px solid var(--gold-bd);margin-top:5rem;text-align:center}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">Smart<em>Shaadi</em> AI💍</a>
  <div id="hbg" style="color:var(--gold);cursor:pointer;font-size:1.5rem">☰</div>
</nav>
<div class="container">
  <div class="blog-hero">
    <div class="blog-cat">City Guide</div>
    <h1>${topic.title}</h1>
    <div class="blog-meta">📅 ${date} | ⏱️ 12 min read | ✍️ SmartShaadi Expert Team</div>
  </div>
  <article class="blog-content">
    ${bodyContent}
  </article>
</div>
<footer>
  <div style="color:var(--gold);font-family:'Cormorant Garamond',serif;font-size:1.5rem;margin-bottom:1rem">SmartShaadi AI</div>
  <p style="color:var(--muted);font-size:0.9rem">© 2026 Smart Shaadi AI. India's #1 AI Wedding Planner.</p>
</footer>
</body>
</html>`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  const topic = getTopicForToday();
  const date = getTodayDate();
  const outputPath = path.join(process.cwd(), topic.slug + '.html');

  const apiKey = process.env.GROQ_API_KEY;
  const prompt = `Write a high-ranking 2000-word SEO blog in Hinglish for "${topic.title}". 
  Include: 
  1. Detailed Introduction.
  2. Budget Table (HTML format).
  3. Bhopal Case Study.
  4. Day vs Night wedding logic.
  5. Local SEO tips and Vendor guide.
  
  Rules: Start directly with HTML content. Do NOT use markdown code blocks (\`\`\`). Use h2, h3, p, table tags only.`;

  try {
    const response = await axios.post('[https://api.groq.com/openai/v1/chat/completions](https://api.groq.com/openai/v1/chat/completions)', {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      }, { headers: { 'Authorization': `Bearer ${apiKey}` } });

    let blogHtml = response.data.choices[0].message.content;
    
    // Clean potential AI mistakes
    blogHtml = blogHtml.replace(/```html|```/g, '').trim();

    const finalHtml = wrapInTemplate(topic, blogHtml, date);
    fs.writeFileSync(outputPath, finalHtml, 'utf-8');
    console.log('🎉 Done! Delhi style blog generated.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
main();
