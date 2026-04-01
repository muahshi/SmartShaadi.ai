const fs = require('fs');
const path = require('path');
const axios = require('axios'); 

// ─── TOPIC CONFIG ─────────────────────────────────────────────────────────────
const BLOG_TOPICS = [
  {
    slug: 'blog-chennai-wedding-cost-2026',
    title: 'Chennai Wedding Cost 2026 — South Indian Shaadi Ka Complete Budget',
    category: 'City Guide',
    keyFocus: 'Chennai wedding budget 2026, Tamil traditions, OMR vs Mylapore, catering costs.'
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

// ─── THE FULL "DELHI STYLE" MASTER TEMPLATE ───────────────────────────────────
function wrapInTemplate(topic, bodyContent, date) {
  const canonical = `https://smartshaadi.online/${topic.slug}.html`;
  
  // Is section mein aapke Delhi blog ka exact HTML aur CSS hai (Navigation + Drawer + Footer)
  return `<!DOCTYPE html>
<html lang="hi-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title} | Smart Shaadi AI</title>
<meta name="description" content="${topic.keyFocus}">
<link rel="canonical" href="${canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--gold:#C9A84C;--gold-bg:rgba(201,168,76,0.08);--gold-bd:rgba(201,168,76,0.25);--bg:#0A0800;--card:#111008;--text:#F5EFE0;--muted:#A89070;--green:#4ADE80;--r:16px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.75;overflow-x:hidden}
a{color:var(--gold);text-decoration:none;transition:0.2s}
nav{background:rgba(10,8,0,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;padding:0 1.5rem;border-bottom:1px solid var(--gold-bd);display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--text)}.nav-logo em{color:var(--gold);font-style:italic}
#hbg{cursor:pointer;width:30px;height:20px;position:relative;display:flex;flex-direction:column;justify-content:space-between}
#hbg span{display:block;height:2px;width:100%;background:var(--gold);transition:0.3s}
#drawer{position:fixed;top:0;right:-100%;width:300px;height:100%;background:var(--bg);z-index:999;transition:0.4s;padding:4rem 2rem;border-left:1px solid var(--gold-bd)}
#drawer.open{right:0}
.container{max-width:800px;margin:0 auto;padding:3rem 1.5rem}
.blog-hero{padding-bottom:2.5rem;border-bottom:1px solid var(--gold-bd);margin-bottom:2.5rem}
.blog-cat{display:inline-block;background:var(--gold-bg);border:1px solid var(--gold-bd);color:var(--gold);font-size:.75rem;text-transform:uppercase;letter-spacing:1px;padding:.4rem 1.2rem;border-radius:100px;margin-bottom:1.5rem}
h1{font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:700;line-height:1.2;margin-bottom:1rem}
.blog-content h2{font-family:'Cormorant Garamond',serif;font-size:2rem;margin:3.5rem 0 1.2rem;color:var(--gold);border-bottom:1px solid var(--gold-bd);padding-bottom:0.5rem}
.blog-content p{margin-bottom:1.5rem;font-size:1.15rem;color:#D1C8B1}
.case-study{background:var(--gold-bg);border-left:4px solid var(--gold);padding:2rem;border-radius:0 var(--r) var(--r) 0;margin:2.5rem 0}
table{width:100%;border-collapse:collapse;margin:2rem 0;background:var(--card);border-radius:var(--r);overflow:hidden;border:1px solid var(--gold-bd)}
th,td{padding:1.2rem;text-align:left;border-bottom:1px solid var(--gold-bd)}
th{background:var(--gold-bg);color:var(--gold)}
footer{background:#070600;padding:5rem 2rem;border-top:1px solid var(--gold-bd);margin-top:5rem}
.fgrid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:3rem}
.fcol h4{color:var(--gold);margin-bottom:1.5rem;font-family:'Cormorant Garamond',serif;font-size:1.4rem}
.fbot{text-align:center;padding-top:3rem;border-top:1px solid #1A1810;margin-top:3rem;color:var(--muted);font-size:.9rem}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">Smart<em>Shaadi</em> AI💍</a>
  <div id="hbg"><span></span><span></span><span></span></div>
</nav>
<div id="drawer">
  <div style="font-size:1.5rem;color:var(--gold);margin-bottom:2rem;cursor:pointer" onclick="document.getElementById('drawer').classList.remove('open')">✕ Close</div>
  <a href="/" style="display:block;padding:1rem 0;font-size:1.2rem">Home</a>
  <a href="/blogs.html" style="display:block;padding:1rem 0;font-size:1.2rem">Blogs</a>
</div>

<div class="container">
  <div class="blog-hero">
    <div class="blog-cat">City Budget Guide 2026</div>
    <h1>${topic.title}</h1>
    <div class="blog-meta">📅 ${date} | ⏱️ 12 min read | ✍️ SmartShaadi Expert Team</div>
  </div>
  <article class="blog-content">
    ${bodyContent}
  </article>
</div>

<footer>
  <div class="fgrid">
    <div class="fcol">
      <div class="nav-logo">Smart<em>Shaadi</em> AI</div>
      <p style="margin-top:1rem;color:var(--muted)">Transforming Complexity into Efficiency through AI & Automation.</p>
    </div>
    <div class="fcol">
      <h4>Navigation</h4>
      <a href="/">Home</a><br><a href="/blogs.html">Blogs</a><br><a href="/about.html">About Us</a>
    </div>
  </div>
  <div class="fbot">© 2026 Smart Shaadi AI. All rights reserved. Made for Indian Couples.</div>
</footer>

<script>
  const hbg = document.getElementById('hbg');
  const drw = document.getElementById('drawer');
  hbg.addEventListener('click', () => drw.classList.toggle('open'));
</script>
</body>
</html>`;
}

// ─── MAIN ACTION ───────────────────────────────────────────────────────────────
async function main() {
  const topic = getTopicForToday();
  const date = getTodayDate();
  const outputPath = path.join(process.cwd(), topic.slug + '.html');
  const apiKey = process.env.GROQ_API_KEY;

  const prompt = `Write a high-ranking 2500-word wedding planning guide for "${topic.title}".
  Use Hinglish language with a professional yet friendly tone.
  
  MANDATORY SECTIONS:
  1. Detailed Introduction.
  2. Budget Breakdown Table (Category, Price Range, Expert Tip).
  3. 'Bhopal Case Study' - A deep comparison with personal insights.
  4. 'Day vs Night' Wedding Analysis (Cost & Logistics).
  5. City-Specific SEO tips (Best time to wed, Local vendor secrets).
  6. FAQ section.
  
  STRICT RULES:
  - DO NOT use markdown code blocks (\`\`\`).
  - Output ONLY pure HTML tags (h2, p, table, ul, li).
  - Use detailed paragraphs for each section.`;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.65
      }, { headers: { 'Authorization': `Bearer ${apiKey}` } });

    let blogHtml = response.data.choices[0].message.content;

    // Cleaning to ensure only pure HTML goes into the article
    blogHtml = blogHtml.replace(/```html|```/gi, '').trim();
    blogHtml = blogHtml.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>|<\/head>|<body>|<\/body>|<title>.*<\/title>/gi, '');

    const finalHtml = wrapInTemplate(topic, blogHtml, date);
    fs.writeFileSync(outputPath, finalHtml, 'utf-8');
    console.log('🎉 Full Updated Blog Created Successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
main();
