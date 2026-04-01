/**
 * SmartShaadi Auto-Blog Generator
 * File: scripts/generate-blog.js
 * * Kya karta hai:
 * 1. Groq API (Llama 3.1) se 1500+ word Hinglish blog generate karta hai
 * 2. Internal links automatically inject karta hai url-map.json se
 * 3. New .html file create karta hai
 * 4. blogs.html mein card add karta hai
 * 5. sitemap.xml update karta hai
 * * Rules:
 * - Author: "SmartShaadi Team" (no personal names)
 * - cleanUrls: false (.html extension required)
 * - Canonical: https://smartshaadi.online/[filename].html
 * - No AdSense <ins> tags
 * - All SS_PRO calls wrapped in try-catch
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Required for Groq API calls

// ─── TOPIC CONFIG ─────────────────────────────────────────────────────────────
// Yahan weekly topics queue hai — script automatically next topic pick karta hai
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
    catColor: 'var(--gr)',
    keyFocus: 'Chennai mein 2026 mein wedding ka budget, South Indian traditions, Mylapore vs OMR venues'
  },
  {
    slug: 'blog-chandigarh-wedding-cost-2026',
    title: 'Chandigarh Wedding Cost 2026 — Punjabi Shaadi Ka Complete Guide',
    category: 'City Guide',
    icon: '🏙️',
    emoji: '🌾',
    catTag: 'city budget',
    searchTerms: 'Chandigarh wedding cost 2026 Punjabi shaadi budget tricity wedding',
    gradient: 'linear-gradient(135deg,#100a1a 0%,#1a1028 100%)',
    readTime: '11 min read',
    catColor: 'var(--gr)',
    keyFocus: 'Chandigarh tricity mein wedding budget, Punjabi traditions, sector 17 vs Mohali venues'
  },
  {
    slug: 'blog-sangeet-ceremony-cost-2026',
    title: 'Sangeet Ceremony Cost 2026 — Planning, Decoration aur Complete Guide',
    category: 'Ceremony Guide',
    icon: '🎤',
    emoji: '🎵',
    catTag: 'planning budget',
    searchTerms: 'sangeet ceremony cost 2026 decoration choreography planning',
    gradient: 'linear-gradient(135deg,#0a0818 0%,#10101e 100%)',
    readTime: '10 min read',
    catColor: '',
    keyFocus: 'Sangeet ceremony budget, choreography cost, decoration, DJ vs live music'
  },
  {
    slug: 'blog-wedding-catering-menu-2026',
    title: 'Wedding Catering Menu Guide 2026 — Veg, Non-Veg, Live Counters',
    category: 'Vendor Guide',
    icon: '🍽️',
    emoji: '🍛',
    catTag: 'vendor budget',
    searchTerms: 'wedding catering menu 2026 veg non veg live counters India',
    gradient: 'linear-gradient(135deg,#120500 0%,#1e0800 100%)',
    readTime: '11 min read',
    catColor: '',
    keyFocus: 'Wedding menu planning, veg vs non-veg costs, live counter charges, wastage control'
  },
  {
    slug: 'blog-wedding-return-gifts-2026',
    title: 'Wedding Return Gifts Guide 2026 — Budget, Ideas aur Packaging',
    category: 'Planning Guide',
    icon: '🎁',
    emoji: '🎀',
    catTag: 'planning budget',
    searchTerms: 'wedding return gifts 2026 India budget ideas favors',
    gradient: 'linear-gradient(135deg,#0a1205 0%,#121e08 100%)',
    readTime: '9 min read',
    catColor: '',
    keyFocus: 'Return gift ideas, budget per person, packaging tips, bulk ordering guide'
  },
  {
    slug: 'blog-bridal-lehenga-cost-2026',
    title: 'Bridal Lehenga Cost 2026 — Sabse Sahi Budget Kya Hai?',
    category: 'Shopping Guide',
    icon: '👗',
    emoji: '🌸',
    catTag: 'shopping budget',
    searchTerms: 'bridal lehenga cost 2026 India designer budget affordable',
    gradient: 'linear-gradient(135deg,#120508 0%,#1e0812 100%)',
    readTime: '11 min read',
    catColor: '',
    keyFocus: 'Bridal lehenga price ranges, designer vs local, rent vs buy, alteration costs'
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
    catColor: 'var(--gr)',
    keyFocus: 'Ahmedabad mein Gujarati wedding traditions, venue costs, veg catering guide'
  },
  {
    slug: 'blog-wedding-photographer-how-to-choose',
    title: 'Wedding Photographer Kaise Chunein 2026 — Complete Selection Guide',
    category: 'Vendor Guide',
    icon: '📸',
    emoji: '📷',
    catTag: 'vendor',
    searchTerms: 'wedding photographer choose 2026 India how to select tips',
    gradient: 'linear-gradient(135deg,#080510 0%,#100818 100%)',
    readTime: '12 min read',
    catColor: '',
    keyFocus: 'Photographer selection criteria, portfolio review, contract checklist, red flags'
  }
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getTodayDate() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function getTopicForToday() {
  // Round-robin — week number se topic select karta hai
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return BLOG_TOPICS[weekNum % BLOG_TOPICS.length];
}

function loadUrlMap() {
  const mapPath = path.join(__dirname, 'url-map.json');
  if (!fs.existsSync(mapPath)) {
    console.warn('⚠️  url-map.json not found. Skipping internal linking.');
    return {};
  }
  return JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
}

/**
 * Internal Linking Logic
 */
function injectInternalLinks(htmlContent, currentSlug, urlMap) {
  const MAX_LINKS = 8;
  let linksAdded = 0;
  const usedUrls = new Set();
  const usedKeywords = new Set();
  let result = htmlContent;

  const entries = Object.entries(urlMap)
    .filter(([url]) => !url.includes(currentSlug))
    .flatMap(([url, data]) =>
      data.keywords.map(kw => ({ url, keyword: kw, title: data.title }))
    )
    .sort((a, b) => b.keyword.length - a.keyword.length);

  for (const { url, keyword, title } of entries) {
    if (linksAdded >= MAX_LINKS) break;
    if (usedUrls.has(url)) continue;
    if (usedKeywords.has(keyword.toLowerCase())) continue;

    const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(?<!<a[^>]*>)(?<![">])\\b(${safeKeyword})\\b(?![^<]*</a>)`,
      'i'
    );

    if (regex.test(result)) {
      const relUrl = url.replace('https://smartshaadi.online', '');
      const link = `<a href="${relUrl}" title="${title}">$1</a>`;
      result = result.replace(regex, link);
      usedUrls.add(url);
      usedKeywords.add(keyword.toLowerCase());
      linksAdded++;
    }
  }

  console.log(`🔗 Internal links injected: ${linksAdded}`);
  return result;
}

/**
 * Blog HTML template
 */
function wrapInTemplate(topic, bodyContent, date) {
  const canonical = `https://smartshaadi.online/${topic.slug}.html`;
  const ogTitle = topic.title;
  const metaDesc = bodyContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 155) + '...';

  return `<!DOCTYPE html>
<html lang="hi-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title} | SmartShaadi</title>
<meta name="description" content="${metaDesc}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://smartshaadi.online/og-shaadi.jpg">
<meta property="og:site_name" content="Smart Shaadi AI">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"${topic.title}","description":"${metaDesc}","url":"${canonical}","datePublished":"${date}","dateModified":"${date}","author":{"@type":"Organization","name":"Smart Shaadi AI","url":"https://smartshaadi.online"},"publisher":{"@type":"Organization","name":"Smart Shaadi AI","url":"https://smartshaadi.online","logo":{"@type":"ImageObject","url":"https://smartshaadi.online/icons/icon-192.png"}},"mainEntityOfPage":{"@type":"WebPage","@id":"${canonical}"}}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--gold:#C9A84C;--gold-bg:rgba(201,168,76,0.08);--gold-bd:rgba(201,168,76,0.25);--bg:#0A0800;--card:#111008;--text:#F5EFE0;--muted:#A89070;--green:#4ADE80;--r:12px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.75;font-size:16px}
a{color:var(--gold);text-decoration:none}a:hover{text-decoration:underline}
nav{background:rgba(10,8,0,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;padding:0 1.5rem;border-bottom:1px solid var(--gold-bd);display:flex;align-items:center;justify-content:space-between;height:56px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;color:var(--text);text-decoration:none}.nav-logo em{color:var(--gold);font-style:italic}
.nav-links{display:flex;gap:1.5rem;font-size:.82rem}.nav-links a{color:var(--muted)}.nav-links a:hover{color:var(--gold);text-decoration:none}
.container{max-width:780px;margin:0 auto;padding:2rem 1.5rem}
.blog-hero{padding:2.5rem 0 1.5rem;border-bottom:1px solid var(--gold-bd);margin-bottom:2rem}
.blog-cat{display:inline-block;background:var(--gold-bg);border:1px solid var(--gold-bd);color:var(--gold);font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;padding:.28rem .85rem;border-radius:100px;margin-bottom:1rem;font-weight:600}
h1{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;line-height:1.25;margin-bottom:1rem}
h1 em{color:var(--gold);font-style:italic}
.blog-meta{display:flex;gap:1rem;flex-wrap:wrap;font-size:.78rem;color:var(--muted)}
.blog-content{font-size:.97rem;line-height:1.85;color:#E8DDD0}
.blog-content h2{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;color:var(--text);margin:2.5rem 0 1rem;padding-bottom:.5rem;border-bottom:1px solid var(--gold-bd)}
.blog-content h3{font-size:1.05rem;font-weight:700;color:var(--gold);margin:1.8rem 0 .7rem}
.blog-content p{margin-bottom:1.2rem}
.blog-content ul,.blog-content ol{margin:1rem 0 1.2rem 1.5rem}.blog-content li{margin-bottom:.6rem}
.blog-content strong{color:var(--text);font-weight:700}
.blog-content a{color:var(--gold);border-bottom:1px solid rgba(201,168,76,0.3)}.blog-content a:hover{border-bottom-color:var(--gold)}
table{width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:.88rem}
th{background:var(--gold-bg);color:var(--gold);padding:.7rem 1rem;text-align:left;font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;border-bottom:1px solid var(--gold-bd)}
td{padding:.65rem 1rem;border-bottom:1px solid rgba(255,255,255,.05);color:var(--muted)}
.case-study{background:linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.02));border-left:3px solid var(--gold);padding:1.4rem 1.6rem;border-radius:0 var(--r) var(--r) 0;margin:2rem 0}
.cs-label{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:.6rem}
.case-study h3{font-size:1rem;margin-bottom:.7rem;color:var(--text)}
.case-study p{font-size:.9rem;color:var(--muted);margin:0;line-height:1.75}
.tool-promo{background:linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.03));border:1px solid var(--gold-bd);border-radius:var(--r);padding:1.4rem 1.6rem;margin:2.5rem 0;display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap}
.tp-text{flex:1;min-width:200px}.tp-label{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:.4rem}
.tp-text h4{font-size:1rem;margin-bottom:.35rem;color:var(--text)}.tp-text p{font-size:.84rem;color:var(--muted);margin:0}
.tp-btn{background:var(--gold);color:#0A0800;padding:.75rem 1.4rem;border-radius:8px;font-size:.85rem;font-weight:700;white-space:nowrap;text-decoration:none;border:none}
.tp-btn:hover{opacity:.9;text-decoration:none}
.faq-section{margin:2.5rem 0}
.faq-section h2{font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700;margin-bottom:1.2rem}
.faq-item{border-bottom:1px solid rgba(255,255,255,.07);padding:.9rem 0}
.faq-q{width:100%;text-align:left;background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:.93rem;font-weight:600;color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;padding:.2rem 0;gap:1rem}
.faq-icon{color:var(--gold);font-size:1.2rem;min-width:20px}
.faq-a{display:none;padding:.6rem 0 .3rem;font-size:.87rem;line-height:1.8;color:var(--muted)}
.faq-item.open .faq-a{display:block}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.8rem;margin-top:1rem}
.related-card{background:var(--card);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:1rem;display:flex;align-items:center;gap:.8rem;text-decoration:none;color:inherit;transition:border-color .2s}
.related-card:hover{border-color:var(--gold-bd);text-decoration:none}
footer{background:#070600;border-top:1px solid var(--gold-bd);padding:2rem 1.5rem;text-align:center;margin-top:3rem}
footer p{font-size:.8rem;color:var(--muted);margin-bottom:.8rem}
.footer-links{display:flex;gap:1.2rem;justify-content:center;flex-wrap:wrap}
.footer-links a{font-size:.78rem;color:var(--muted)}.footer-links a:hover{color:var(--gold)}
@media(max-width:600px){h1{font-size:1.55rem}.nav-links{display:none}.container{padding:1.5rem 1rem}}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">Smart<em>Shaadi</em> 💍</a>
  <div class="nav-links">
    <a href="/">Home</a><a href="/blogs.html">Blog</a><a href="/ai-tools.html">AI Tools</a><a href="/contact.html">Contact</a>
  </div>
</nav>
<div class="container">
  <div class="blog-hero">
    <div class="blog-cat">${topic.icon} ${topic.category}</div>
    <h1>${topic.title.replace(' — ', ' — <em>').replace(/(<em>[^<]+)$/, '$1</em>')}</h1>
    <div class="blog-meta">
      <span>📅 ${date}</span>
      <span>⏱️ ${topic.readTime}</span>
      <span>✍️ SmartShaadi AI Team</span>
    </div>
  </div>

  <div class="blog-content">
${bodyContent}
  </div>

  <div style="margin:2.5rem 0;padding-top:2rem;border-top:1px solid var(--gold-bd)">
    <div style="font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem;font-weight:700">Yeh Bhi Padhein</div>
    <div class="related-grid">
      <a href="/blog-budget-2026.html" class="related-card"><span style="font-size:1.5rem">💰</span><div><strong style="display:block;font-size:.85rem">Wedding Budget Guide 2026</strong><span style="font-size:.75rem;color:var(--muted)">Complete India guide</span></div></a>
      <a href="/wedding-budget-calculator-india-2026.html" class="related-card"><span style="font-size:1.5rem">🧮</span><div><strong style="display:block;font-size:.85rem">Budget Calculator Tool</strong><span style="font-size:.75rem;color:var(--muted)">Free, instant results</span></div></a>
      <a href="/wedding-vendor-negotiation-bot.html" class="related-card"><span style="font-size:1.5rem">🤝</span><div><strong style="display:block;font-size:.85rem">Vendor Negotiation Bot</strong><span style="font-size:.75rem;color:var(--muted)">Scripts + tips free</span></div></a>
    </div>
  </div>
</div>

<footer>
  <p>SmartShaadi.online — India's #1 Free AI Wedding Planner | 13 AI Tools — 100% Free</p>
  <div class="footer-links">
    <a href="/">Home</a><a href="/blogs.html">Blog</a><a href="/ai-tools.html">AI Tools</a>
    <a href="/about.html">About</a><a href="/contact.html">Contact</a>
    <a href="/privacy-policy.html">Privacy Policy</a><a href="/terms.html">Terms</a>
  </div>
</footer>
<script>
document.querySelectorAll('.faq-q').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item = this.parentElement;
    item.classList.toggle('open');
    var icon = this.querySelector('.faq-icon');
    if (icon) icon.textContent = item.classList.contains('open') ? '−' : '+';
  });
});
try {
  if (typeof SS_PRO !== 'undefined' && SS_PRO.isProLocal && SS_PRO.isProLocal()) {
    SS_PRO.init();
  }
} catch(e) {
  console.warn('SS_PRO init skipped:', e.message);
}
</script>
</body>
</html>`;
}

/**
 * blogs.html update
 */
function addToBlogsPage(topic, date) {
  const blogsPath = path.join(__dirname, '..', 'blogs.html');
  if (!fs.existsSync(blogsPath)) return;
  let blogsContent = fs.readFileSync(blogsPath, 'utf-8');
  if (blogsContent.includes(topic.slug + '.html')) return;

  const newCard = `
    <a href="${topic.slug}.html" class="acard reveal" data-cat="${topic.catTag}" data-search="${topic.searchTerms}">
      <div class="acard-thumb"><div class="acard-thumb-bg" style="background:${topic.gradient}"></div><span class="acard-badge" style="background:rgba(126,211,160,.85);color:#08060E">🆕 NEW</span><span class="acard-thumb-icon">${topic.emoji}</span><div class="acard-thumb-overlay">${topic.category} • ${topic.readTime}</div></div>
      <div class="acard-body"><span class="acard-cat"${topic.catColor ? ` style="color:${topic.catColor}"` : ''}>${topic.category}</span><div class="acard-title">${topic.title}</div><div class="acard-desc">SmartShaadi AI ne likha hai — real data, honest advice, Hinglish mein. ${date} ko publish kiya gaya.</div><div class="acard-footer"><div class="acard-read">Read Guide →</div><div class="acard-meta">${topic.readTime}</div></div></div>
    </a>`;

  const insertPoint = blogsContent.lastIndexOf('</a>\n    </div>');
  if (insertPoint === -1) return;
  blogsContent = blogsContent.slice(0, insertPoint + 4) + newCard + '\n' + blogsContent.slice(insertPoint + 4);
  fs.writeFileSync(blogsPath, blogsContent, 'utf-8');
}

/**
 * sitemap.xml update
 */
function updateSitemap(topic, date) {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return;
  let sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  const url = `https://smartshaadi.online/${topic.slug}.html`;
  if (sitemap.includes(url)) return;

  const newEntry = `
  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

  sitemap = sitemap.replace('</urlset>', newEntry + '\n</urlset>');
  fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
}

/**
 * url-map.json update
 */
function updateUrlMap(topic) {
  const mapPath = path.join(__dirname, 'url-map.json');
  const urlMap = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, 'utf-8')) : {};
  const url = `https://smartshaadi.online/${topic.slug}.html`;
  if (!urlMap[url]) {
    urlMap[url] = {
      slug: topic.slug,
      title: topic.title,
      keywords: topic.searchTerms.split(' ').filter(w => w.length > 4).slice(0, 6)
    };
    fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2), 'utf-8');
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 SmartShaadi Auto-Blog Generator (Groq Edition) starting...\n');

  const topic = getTopicForToday();
  const date = getTodayDate();
  const outputPath = path.join(__dirname, '..', topic.slug + '.html');

  if (fs.existsSync(outputPath)) {
    console.log(`ℹ️  ${topic.slug}.html already exists. Skipping generation.`);
    process.exit(0);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable not set!');
  }

  const prompt = `Tu SmartShaadi.online ka expert content writer hai. Ek comprehensive wedding planning blog likhna hai.

TOPIC: ${topic.title}
KEY FOCUS: ${topic.keyFocus}
DATE: ${date}

MANDATORY REQUIREMENTS:
1. Minimum 1500 words
2. Language: Hinglish
3. Author: "SmartShaadi AI Team"
4. Tone: Friendly, practical, expert

MANDATORY SECTIONS:
<p>[2-3 para introduction]</p>
<h2>2026 Mein [Topic] — Realistic Budget Overview</h2>
[Budget ranges + comparison table]
<div class="case-study"><div class="cs-label">✦ Real Couple Story — Bhopal</div><h3>[Couple Names] — Bhopal, [Month] 2026</h3><p>[Story about saving money with SmartShaadi]</p></div>
<h2>Day vs Night — Kya Fark Padta Hai?</h2>
<h2>[Topic-specific H2]</h2>
<div class="tool-promo"><div class="tp-text"><div class="tp-label">✦ Free AI Tool</div><h4>[Tool Name]</h4><p>[Benefit]</p></div><a href="/[tool].html" class="tp-btn">[CTA] →</a></div>
<h2>Conclusion</h2>

FAQ SECTION Structure:
<div class="faq-section"><h2>❓ Aksar Poochhe Jaane Wale Sawaal</h2><div class="faq-item"><button class="faq-q">Q1? <span class="faq-icon">+</span></button><div class="faq-a">Answer</div></div></div>... (5 total)

FAQ Schema JSON-LD included at the end.
No markdown, pure HTML, no generic advice. Use ₹ symbol.`;

  console.log('📡 Calling Groq API...');

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4096
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    const blogHtml = response.data.choices[0].message.content;
    console.log(`✅ Blog generated: ${blogHtml.length} characters`);

    const urlMap = loadUrlMap();
    const linkedHtml = injectInternalLinks(blogHtml, topic.slug, urlMap);
    const finalHtml = wrapInTemplate(topic, linkedHtml, date);

    fs.writeFileSync(outputPath, finalHtml, 'utf-8');
    addToBlogsPage(topic, date);
    updateSitemap(topic, date);
    updateUrlMap(topic);

    console.log('\n🎉 Auto-blog generation complete!');
  } catch (err) {
    console.error('❌ Groq API Error:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

