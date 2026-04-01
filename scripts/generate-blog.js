const fs = require('fs');
const path = require('path');
const axios = require('axios'); 

// ─── TOPIC CONFIG ─────────────────────────────────────────────────────────────
const BLOG_TOPICS = [
  {
    slug: 'blog-chennai-wedding-cost-2026',
    title: 'Chennai Wedding Cost 2026 — South Indian Shaadi Ka Complete Budget',
    category: 'City Guide',
    keyFocus: 'Chennai wedding budget, Tamil traditions, OMR vs Mylapore, catering costs.'
  },
  {
    slug: 'blog-ahmedabad-wedding-cost-2026',
    title: 'Ahmedabad Wedding Cost 2026 — Gujarati Shaadi Ka Complete Budget',
    category: 'City Guide',
    keyFocus: 'Ahmedabad wedding planning, Gujarati traditions, SG Highway venues, veg catering prices.'
  }
];

function getTodayDate() { return new Date().toISOString().split('T')[0]; }

function getTopicForToday() {
  if (process.env.TOPIC_OVERRIDE) {
    const override = BLOG_TOPICS.find(t => t.slug === process.env.TOPIC_OVERRIDE);
    if (override) return override;
  }
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return BLOG_TOPICS[weekNum % BLOG_TOPICS.length];
}

// ─── THE FULL "DELHI" MASTER TEMPLATE (1:1 COPY) ──────────────────────────────
function wrapInTemplate(topic, bodyContent, date) {
  return `<!DOCTYPE html>
<html lang="hi-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title} | Smart Shaadi AI</title>
<link rel="stylesheet" href="style.css">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--gold:#C9A84C;--gold-bg:rgba(201,168,76,0.08);--gold-bd:rgba(201,168,76,0.25);--bg:#0A0800;--card:#111008;--text:#F5EFE0;--muted:#A89070;--r:16px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.75;overflow-x:hidden}
nav{background:rgba(10,8,0,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;padding:0 1.5rem;border-bottom:1px solid var(--gold-bd);display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--text)}.nav-logo em{color:var(--gold);font-style:italic}
#hbg{cursor:pointer;width:30px;height:18px;display:flex;flex-direction:column;justify-content:space-between}
#hbg span{display:block;height:2px;width:100%;background:var(--gold)}
#drawer{position:fixed;top:0;right:-100%;width:300px;height:100%;background:var(--bg);z-index:999;transition:0.4s;padding:4rem 2rem;border-left:1px solid var(--gold-bd)}
#drawer.open{right:0}
.container{max-width:800px;margin:0 auto;padding:3rem 1.5rem}
.blog-hero{padding-bottom:2.5rem;border-bottom:1px solid var(--gold-bd);margin-bottom:2.5rem}
.blog-cat{display:inline-block;background:var(--gold-bg);border:1px solid var(--gold-bd);color:var(--gold);font-size:.75rem;text-transform:uppercase;padding:.4rem 1.2rem;border-radius:100px;margin-bottom:1.5rem}
h1{font-family:'Cormorant Garamond',serif;font-size:2.8rem;line-height:1.2;margin-bottom:1rem}
.blog-content h2{font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--gold);margin:3.5rem 0 1.2rem;border-bottom:1px solid var(--gold-bd);padding-bottom:10px}
.blog-content p{margin-bottom:1.5rem;font-size:1.15rem;color:#D1C8B1}
table{width:100%;border-collapse:collapse;margin:2rem 0;background:var(--card);border-radius:12px;overflow:hidden;border:1px solid var(--gold-bd)}
th,td{padding:1.2rem;text-align:left;border-bottom:1px solid var(--gold-bd)}
th{background:var(--gold-bg);color:var(--gold)}
footer{background:#070600;padding:5rem 2rem;border-top:1px solid var(--gold-bd);margin-top:5rem;text-align:center}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">Smart<em>Shaadi</em> AI💍</a>
  <div id="hbg" onclick="document.getElementById('drawer').classList.toggle('open')"><span></span><span></span><span></span></div>
</nav>
<div id="drawer">
  <div style="font-size:1.5rem;color:var(--gold);margin-bottom:2rem;cursor:pointer" onclick="document.getElementById('drawer').classList.remove('open')">✕ Close</div>
  <a href="/" style="display:block;padding:1rem 0;font-size:1.2rem">Home</a>
  <a href="/blogs.html" style="display:block;padding:1rem 0;font-size:1.2rem">Blogs</a>
</div>
<div class="container">
  <div class="blog-hero">
    <div class="blog-cat">Shaadi Guide</div>
    <h1>${topic.title}</h1>
    <p>📅 ${date} | ✍️ SmartShaadi Expert Team</p>
  </div>
  <article class="blog-content">${bodyContent}</article>
</div>
<footer>
  <div class="nav-logo">Smart<em>Shaadi</em> AI</div>
  <p style="color:var(--muted);margin-top:1rem;font-size:0.9rem">© 2026 Smart Shaadi AI. India's #1 AI Wedding Planner.</p>
</footer>
</body>
</html>`;
}

async function main() {
  const topic = getTopicForToday();
  const date = getTodayDate();
  
  // FIXED PATH: Root directory mein file banaye
  const outputPath = path.join(process.cwd(), topic.slug + '.html');
  const apiKey = process.env.GROQ_API_KEY;

  console.log(`🚀 Starting generation for: ${topic.slug}`);

  const prompt = `Write a 2500-word Hinglish wedding guide for "${topic.title}". 
  Include: Intro, Budget Table (HTML), Bhopal Case Study, Day vs Night pros/cons, Local SEO tips, FAQ.
  Rule: ONLY HTML tags. No markdown.`;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6
      }, { headers: { 'Authorization': `Bearer ${apiKey}` } });

    let content = response.data.choices[0].message.content;
    content = content.replace(/```html|```/gi, '').trim();

    const finalHtml = wrapInTemplate(topic, content, date);
    
    // File likhna
    fs.writeFileSync(outputPath, finalHtml, 'utf-8');
    
    console.log(`✅ SUCCESS: Created ${outputPath}`);
    console.log(`📂 Files in directory: ${fs.readdirSync(process.cwd()).join(', ')}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
main();
