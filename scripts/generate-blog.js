const fs = require('fs');
const path = require('path');
const axios = require('axios'); 

// ─── TOPIC CONFIG (Yahan naye topics add kar sakte hain) ──────────────────────
const BLOG_TOPICS = [
  {
    slug: 'blog-chennai-wedding-cost-2026',
    title: 'Chennai Wedding Cost 2026 — South Indian Shaadi Ka Complete Budget',
    category: 'City Guide',
    keyFocus: 'Chennai wedding budget, Tamil traditions, OMR vs Mylapore, 2026 inflation.'
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
  // Agar workflow dispatch se topic aaya hai toh wo use karein, nahi toh scheduled
  if (process.env.TOPIC_OVERRIDE) {
    const override = BLOG_TOPICS.find(t => t.slug === process.env.TOPIC_OVERRIDE);
    if (override) return override;
  }
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return BLOG_TOPICS[weekNum % BLOG_TOPICS.length];
}

// ─── THE FULL "DELHI STYLE" MASTER TEMPLATE (1:1 Design) ─────────────────────
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
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--gold:#C9A84C;--gold-bg:rgba(201,168,76,0.08);--gold-bd:rgba(201,168,76,0.25);--bg:#0A0800;--card:#111008;--text:#F5EFE0;--muted:#A89070;--r:16px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.75;overflow-x:hidden}
a{color:var(--gold);text-decoration:none;transition:0.2s}
nav{background:rgba(10,8,0,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;padding:0 1.5rem;border-bottom:1px solid var(--gold-bd);display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--text)}.nav-logo em{color:var(--gold);font-style:italic}
#hbg{cursor:pointer;width:30px;height:20px;display:flex;flex-direction:column;justify-content:space-between}
#hbg span{display:block;height:2px;width:100%;background:var(--gold)}
#drawer{position:fixed;top:0;right:-100%;width:300px;height:100%;background:var(--bg);z-index:999;transition:0.4s;padding:4rem 2rem;border-left:1px solid var(--gold-bd)}
#drawer.open{right:0}
.container{max-width:800px;margin:0 auto;padding:3rem 1.5rem}
.blog-hero{padding-bottom:2.5rem;border-bottom:1px solid var(--gold-bd);margin-bottom:2.5rem}
.blog-cat{display:inline-block;background:var(--gold-bg);border:1px solid var(--gold-bd);color:var(--gold);font-size:.75rem;text-transform:uppercase;padding:.4rem 1.2rem;border-radius:100px;margin-bottom:1.5rem}
h1{font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:700;line-height:1.2;margin-bottom:1rem}
.blog-content h2{font-family:'Cormorant Garamond',serif;font-size:2rem;margin:3.5rem 0 1.2rem;color:var(--gold);border-bottom:1px solid var(--gold-bd);padding-bottom:0.5rem}
.blog-content p{margin-bottom:1.5rem;font-size:1.15rem;color:#D1C8B1}
.case-study{background:var(--gold-bg);border-left:4px solid var(--gold);padding:2rem;margin:2.5rem 0;border-radius:0 var(--r) var(--r) 0}
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
    <div class="blog-cat">Shaadi Intelligence</div>
    <h1>${topic.title}</h1>
    <div class="blog-meta">📅 ${date} | ⏱️ 12 min read | ✍️ SmartShaadi Expert Team</div>
  </div>
  <article class="blog-content">
    ${bodyContent}
  </article>
</div>
<footer>
  <div class="nav-logo">Smart<em>Shaadi</em> AI</div>
  <p style="color:var(--muted);margin-top:1rem;font-size:0.9rem">© 2026 Smart Shaadi AI. Transforming Complexity into Efficiency.</p>
</footer>
</body>
</html>`;
}

// ─── MAIN LOGIC ───────────────────────────────────────────────────────────────
async function main() {
  const topic = getTopicForToday();
  const date = getTodayDate();
  const outputPath = path.join(process.cwd(), topic.slug + '.html');
  const apiKey = process.env.GROQ_API_KEY;

  // Check if file exists to avoid double generation (unless forced)
  if (fs.existsSync(outputPath) && process.env.FORCE_REGENERATE !== 'true') {
    console.log(`ℹ️ File ${topic.slug}.html already exists. Use Force Regenerate to overwrite.`);
    process.exit(0);
  }

  const prompt = `Write a premium, high-ranking 2500-word wedding guide in Hinglish for "${topic.title}".
  Include these HTML sections:
  1. Detailed Intro.
  2. Professional Budget Table (2026 rates).
  3. 'Bhopal Case Study' with personal automation architect insights.
  4. 'Day vs Night' wedding logic.
  5. Local city SEO tips & Vendor secrets.
  6. FAQ.
  
  RULES: Use ONLY HTML (h2, p, table, ul, li). NO markdown backticks (\`\`\`). Language: Proper Hinglish.`;

  try {
    console.log('📡 Generating content with Groq...');
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.65
      }, { headers: { 'Authorization': `Bearer ${apiKey}` } });

    let content = response.data.choices[0].message.content;

    // ─── CLEANING (Plain text fix) ───
    content = content.replace(/```html|```/gi, '').trim();
    content = content.replace(/<!DOCTYPE html>|<html>|<\/html>|<head>|<\/head>|<body>|<\/body>|<title>.*<\/title>/gi, '');

    const finalHtml = wrapInTemplate(topic, content, date);
    fs.writeFileSync(outputPath, finalHtml, 'utf-8');
    console.log(`🎉 Success! ${topic.slug}.html generated with full Delhi-style template.`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
