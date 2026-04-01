const fs = require('fs');
const path = require('path');
const axios = require('axios'); 

// ─── TOPIC CONFIG ─────────────────────────────────────────────────────────────
const BLOG_TOPICS = [
  {
    slug: 'blog-chennai-wedding-cost-2026',
    title: 'Chennai Wedding Cost 2026 — South Indian Shaadi Ka Complete Budget',
    category: 'City Guide',
    keyFocus: 'Chennai wedding budget, South Indian traditions, OMR vs Mylapore, 2026 inflation.'
  },
  {
    slug: 'blog-ahmedabad-wedding-cost-2026',
    title: 'Ahmedabad Wedding Cost 2026 — Gujarati Shaadi Ka Complete Budget',
    category: 'City Guide',
    keyFocus: 'Ahmedabad wedding planning, Gujarati traditions, SG Highway venues, veg catering prices.'
  }
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getTodayDate() { return new Date().toISOString().split('T')[0]; }
function getTopicForToday() {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return BLOG_TOPICS[weekNum % BLOG_TOPICS.length];
}

// ─── THE "DELHI" TEMPLATE (FULL DESIGN) ───────────────────────────────────────
function wrapInTemplate(topic, bodyContent, date) {
  return `<!DOCTYPE html>
<html lang="hi-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title} | Smart Shaadi AI</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
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
.blog-content h2{font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--gold);margin:3.5rem 0 1.2rem;border-bottom:1px solid var(--gold-bd);padding-bottom:10px}
.blog-content p{margin-bottom:1.5rem;font-size:1.1rem;color:#D1C8B1}
.case-study{background:var(--gold-bg);border-left:4px solid var(--gold);padding:2rem;margin:2.5rem 0;border-radius:0 var(--r) var(--r) 0}
table{width:100%;border-collapse:collapse;margin:2rem 0;background:var(--card);border-radius:12px;overflow:hidden;border:1px solid var(--gold-bd)}
th,td{padding:1.2rem;text-align:left;border-bottom:1px solid var(--gold-bd)}
th{background:var(--gold-bg);color:var(--gold)}
footer{background:#070600;padding:4rem 2rem;border-top:1px solid var(--gold-bd);margin-top:5rem;text-align:center}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">Smart<em>Shaadi</em> AI💍</a>
  <div style="color:var(--gold);cursor:pointer;font-size:1.2rem">Menu ☰</div>
</nav>
<div class="container">
  <div class="blog-hero">
    <div class="blog-cat">Premium Strategy</div>
    <h1>${topic.title}</h1>
    <div class="blog-meta">📅 ${date} | ⏱️ 12 min read | ✍️ SmartShaadi Team</div>
  </div>
  <article class="blog-content">
    ${bodyContent}
  </article>
</div>
<footer>
  <p style="color:var(--gold);font-family:'Cormorant Garamond',serif;font-size:1.5rem">SmartShaadi AI</p>
  <p style="color:var(--muted);font-size:0.85rem;margin-top:1rem">© 2026 Smart Shaadi AI. India's Expert Wedding Planner.</p>
</footer>
</body>
</html>`;
}

// ─── MAIN ACTION ───────────────────────────────────────────────────────────────
async function main() {
  const topic = getTopicForToday();
  const date = getTodayDate();
  const outputPath = path.join(process.cwd(), topic.slug + '.html');
  const apiKey = process.env.GROQ_API_KEY;

  const prompt = `Write a professional 2000-word Hinglish wedding guide for "${topic.title}".
  Structure:
  1. Intro
  2. Budget Table (HTML)
  3. Bhopal Case Study
  4. Day vs Night Analysis
  5. Local SEO/Vendor Tips
  
  CRITICAL: DO NOT use markdown code blocks (\`\`\`). Start directly with HTML tags like <h2> or <p>. 
  Language: Natural Hinglish (Bhopali touch for case study).`;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6
      }, { headers: { 'Authorization': `Bearer ${apiKey}` } });

    let rawContent = response.data.choices[0].message.content;

    // ─── LAYER 2 CLEANING (FIX FOR PLAIN TEXT ISSUE) ──────────────────────────
    // 1. Remove Markdown Backticks
    let cleanContent = rawContent.replace(/```html|```/gi, '').trim();
    // 2. Remove any accidental full-page tags AI might have added
    cleanContent = cleanContent.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>|<\/head>|<body>|<\/body>|<meta.*>|<title>.*<\/title>/gi, '');

    const finalHtml = wrapInTemplate(topic, cleanContent, date);
    fs.writeFileSync(outputPath, finalHtml, 'utf-8');
    console.log('🎉 Done! HTML Rendering Fix Applied.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
main();
