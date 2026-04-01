const fs = require('fs');
const path = require('path');
const axios = require('axios'); 

// ─── TOPIC CONFIG ─────────────────────────────────────────────────────────────
const BLOG_TOPICS = [
  {
    slug: 'blog-chennai-wedding-cost-2026',
    title: 'Chennai Wedding Cost 2026 — South Indian Shaadi Ka Complete Budget',
    category: 'City Guide',
    icon: '🏙️',
    emoji: '🏛️',
    catTag: 'city budget',
    searchTerms: 'Chennai wedding cost 2026 South Indian shaadi budget Tamil wedding',
    gradient: 'linear-gradient(135deg,#0a1208 0%,#121e08 100%)',
    readTime: '12 min read',
    keyFocus: 'Chennai mein 2026 mein wedding ka budget, South Indian traditions, Mylapore vs OMR venues'
  },
  {
    slug: 'blog-ahmedabad-wedding-cost-2026',
    title: 'Ahmedabad Wedding Cost 2026 — Gujarati Shaadi Ka Complete Budget',
    category: 'City Guide',
    icon: '🏙️',
    emoji: '🌺',
    catTag: 'city budget',
    searchTerms: 'Ahmedabad wedding cost 2026 Gujarati shaadi budget',
    gradient: 'linear-gradient(135deg,#0e1008 0%,#181a08 100%)',
    readTime: '11 min read',
    keyFocus: 'Ahmedabad mein Gujarati wedding traditions, venue costs, veg catering guide'
  }
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function getTopicForToday() {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return BLOG_TOPICS[weekNum % BLOG_TOPICS.length];
}

function loadUrlMap() {
  const mapPath = path.join(__dirname, 'url-map.json');
  return fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, 'utf-8')) : {};
}

function injectInternalLinks(htmlContent, currentSlug, urlMap) {
  const MAX_LINKS = 8;
  let linksAdded = 0;
  const usedUrls = new Set();
  let result = htmlContent;

  const entries = Object.entries(urlMap)
    .filter(([url]) => !url.includes(currentSlug))
    .flatMap(([url, data]) => data.keywords.map(kw => ({ url, keyword: kw, title: data.title })))
    .sort((a, b) => b.keyword.length - a.keyword.length);

  for (const { url, keyword, title } of entries) {
    if (linksAdded >= MAX_LINKS || usedUrls.has(url)) continue;
    const regex = new RegExp(`(?<!<a[^>]*>)\\b(${keyword})\\b(?![^<]*</a>)`, 'i');
    if (regex.test(result)) {
      const relUrl = url.replace('[https://smartshaadi.online](https://smartshaadi.online)', '');
      result = result.replace(regex, `<a href="${relUrl}" title="${title}">$1</a>`);
      usedUrls.add(url);
      linksAdded++;
    }
  }
  return result;
}

// ─── DESIGN TEMPLATE (DELHI STYLE) ─────────────────────────────────────────────

function wrapInTemplate(topic, bodyContent, date) {
  const canonical = `https://smartshaadi.online/${topic.slug}.html`;
  
  return `<!DOCTYPE html>
<html lang="hi-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title} | Smart Shaadi AI</title>
<meta name="description" content="${topic.keyFocus} - Complete guide with budget breakdown and expert tips.">
<link rel="canonical" href="${canonical}">
<link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
<link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
<link href="[https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap](https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap)" rel="stylesheet">
<style>
:root{--gold:#C9A84C;--gold-bg:rgba(201,168,76,0.08);--gold-bd:rgba(201,168,76,0.25);--bg:#0A0800;--card:#111008;--text:#F5EFE0;--muted:#A89070;--green:#4ADE80;--r:16px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.75;overflow-x:hidden}
a{color:var(--gold);text-decoration:none;transition:0.2s}
nav{background:rgba(10,8,0,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;padding:0 1.5rem;border-bottom:1px solid var(--gold-bd);display:flex;align-items:center;justify-content:space-between;height:64px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--text)}.nav-logo em{color:var(--gold);font-style:italic}
.container{max-width:800px;margin:0 auto;padding:3rem 1.5rem}
.blog-hero{padding-bottom:2.5rem;border-bottom:1px solid var(--gold-bd);margin-bottom:2.5rem}
.blog-cat{display:inline-block;background:var(--gold-bg);border:1px solid var(--gold-bd);color:var(--gold);font-size:.75rem;text-transform:uppercase;letter-spacing:1px;padding:.4rem 1.2rem;border-radius:100px;margin-bottom:1.5rem}
h1{font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:700;line-height:1.2;margin-bottom:1rem}
.blog-content h2{font-family:'Cormorant Garamond',serif;font-size:1.8rem;margin:3rem 0 1.2rem;color:var(--gold);border-bottom:1px solid var(--gold-bd);padding-bottom:0.5rem}
.blog-content p{margin-bottom:1.5rem;font-size:1.1rem;color:#D1C8B1}
.case-study{background:var(--gold-bg);border-left:4px solid var(--gold);padding:2rem;border-radius:0 var(--r) var(--r) 0;margin:2.5rem 0}
table{width:100%;border-collapse:collapse;margin:2rem 0;background:var(--card);border-radius:var(--r);overflow:hidden}
th,td{padding:1.2rem;text-align:left;border-bottom:1px solid var(--gold-bd)}
th{background:var(--gold-bg);color:var(--gold)}
footer{background:#070600;padding:4rem 2rem;border-top:1px solid var(--gold-bd);margin-top:5rem}
.fgrid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:3rem}
h4{color:var(--gold);margin-bottom:1.5rem;font-family:'Cormorant Garamond',serif;font-size:1.3rem}
ul{list-style:none}li{margin-bottom:.8rem}
.fbot{text-align:center;padding-top:3rem;border-top:1px solid #1A1810;margin-top:3rem;color:var(--muted);font-size:.9rem}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">Smart<em>Shaadi</em> AI💍</a>
  <div style="color:var(--gold);cursor:pointer">Menu ☰</div>
</nav>
<div class="container">
  <div class="blog-hero">
    <div class="blog-cat">${topic.icon} ${topic.category}</div>
    <h1>${topic.title}</h1>
    <div class="blog-meta">📅 ${date} | ⏱️ ${topic.readTime} | ✍️ SmartShaadi Expert Team</div>
  </div>
  <article class="blog-content">
    ${bodyContent}
  </article>
</div>
<footer>
  <div class="fgrid">
    <div class="fcol"><h4>SmartShaadi AI</h4><p>Making premium wedding planning accessible to everyone.</p></div>
    <div class="fcol"><h4>Quick Links</h4><ul><li><a href="/">Home</a></li><li><a href="/blogs.html">Blogs</a></li></ul></div>
  </div>
  <div class="fbot">© 2026 Smart Shaadi AI. All rights reserved.</div>
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
  const prompt = `Tu SmartShaadi.online ka senior content architect hai.
  TASK: ${topic.title} par ek high-ranking SEO blog likho.
  TONE: Professional yet Hinglish.
  
  CONTENT STRUCTURE:
  1. Detailed Introduction.
  2. Budget Table (Category, Cost Range, Tips).
  3. 'Bhopal Case Study' - comparing costs based on personal experience.
  4. 'Day vs Night' wedding logic.
  5. Local SEO tips and Vendor selection.
  6. Conclusion with FAQ.
  
  IMPORTANT: Use only HTML tags (h2, h3, p, table, ul, li). Do not use Markdown backticks or any other text. Start directly with the content. 1800+ words.`;

  try {
    console.log('📡 Calling Groq...');
    const response = await axios.post('[https://api.groq.com/openai/v1/chat/completions](https://api.groq.com/openai/v1/chat/completions)', {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      }, { headers: { 'Authorization': `Bearer ${apiKey}` } });

    let blogHtml = response.data.choices[0].message.content;
    
    // Safety Fix: Removing any markdown code blocks if AI accidentally adds them
    blogHtml = blogHtml.replace(/```html|```/g, '').trim();

    const finalHtml = wrapInTemplate(topic, injectInternalLinks(blogHtml, topic.slug, loadUrlMap()), date);

    fs.writeFileSync(outputPath, finalHtml, 'utf-8');
    console.log('🎉 Full Template Blog Created!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
