/**
 * SmartShaadi Auto-Blog Generator
 * File: scripts/generate-blog.js
 * * Kya karta hai:
 * 1. Groq API (Llama 3.3) se 1500+ word Hinglish blog generate karta hai
 * 2. Internal links automatically inject karta hai url-map.json se
 * 3. New .html file create karta hai
 * 4. blogs.html mein card add karta hai
 * 5. sitemap.xml update karta hai
 */

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
  return new Date().toISOString().split('T')[0];
}

function getTopicForToday() {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return BLOG_TOPICS[weekNum % BLOG_TOPICS.length];
}

function loadUrlMap() {
  const mapPath = path.join(__dirname, 'url-map.json');
  if (!fs.existsSync(mapPath)) {
    console.warn('⚠️ url-map.json not found. Skipping internal linking.');
    return {};
  }
  return JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
}

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
  return result;
}

function wrapInTemplate(topic, bodyContent, date) {
  const canonical = `https://smartshaadi.online/${topic.slug}.html`;
  const ogTitle = topic.title;
  const metaDesc = bodyContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 155) + '...';

  return `<!DOCTYPE html>
<html lang="hi-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title} | SmartShaadi</title>
<meta name="description" content="${metaDesc}">
<link rel="canonical" href="${canonical}">
<style>
:root{--gold:#C9A84C;--gold-bg:rgba(201,168,76,0.08);--gold-bd:rgba(201,168,76,0.25);--bg:#0A0800;--card:#111008;--text:#F5EFE0;--muted:#A89070;--green:#4ADE80;--r:12px}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.75;font-size:16px}
a{color:var(--gold);text-decoration:none}
nav{background:rgba(10,8,0,0.95);backdrop-filter:blur(12px);position:sticky;top:0;z-index:100;padding:0 1.5rem;border-bottom:1px solid var(--gold-bd);display:flex;align-items:center;justify-content:space-between;height:56px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;color:var(--text)}.nav-logo em{color:var(--gold);font-style:italic}
.container{max-width:780px;margin:0 auto;padding:2rem 1.5rem}
.blog-hero{padding:2.5rem 0 1.5rem;border-bottom:1px solid var(--gold-bd);margin-bottom:2rem}
.blog-cat{display:inline-block;background:var(--gold-bg);border:1px solid var(--gold-bd);color:var(--gold);font-size:.68rem;text-transform:uppercase;padding:.28rem .85rem;border-radius:100px;margin-bottom:1rem}
h1{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;line-height:1.25}
h1 em{color:var(--gold);font-style:italic}
.blog-content h2{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;margin:2.5rem 0 1rem;border-bottom:1px solid var(--gold-bd)}
.case-study{background:linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.02));border-left:3px solid var(--gold);padding:1.4rem;border-radius:0 var(--r) var(--r) 0;margin:2rem 0}
.tool-promo{background:linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.03));border:1px solid var(--gold-bd);border-radius:var(--r);padding:1.4rem;margin:2.5rem 0;display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap}
.tp-btn{background:var(--gold);color:#0A0800;padding:.75rem 1.4rem;border-radius:8px;font-weight:700}
footer{background:#070600;border-top:1px solid var(--gold-bd);padding:2rem;text-align:center;margin-top:3rem;font-size:.8rem;color:var(--muted)}
</style>
</head>
<body>
<nav><a href="/" class="nav-logo">Smart<em>Shaadi</em> 💍</a></nav>
<div class="container">
  <div class="blog-hero">
    <div class="blog-cat">${topic.icon} ${topic.category}</div>
    <h1>${topic.title.replace(' — ', ' — <em>').replace(/(<em>[^<]+)$/, '$1</em>')}</h1>
    <div class="blog-meta">📅 ${date} | ⏱️ ${topic.readTime} | ✍️ SmartShaadi AI Team</div>
  </div>
  <div class="blog-content">${bodyContent}</div>
</div>
<footer>SmartShaadi.online — India's #1 Free AI Wedding Planner</footer>
</body>
</html>`;
}

function addToBlogsPage(topic, date) {
  const blogsPath = path.join(__dirname, '..', 'blogs.html');
  if (!fs.existsSync(blogsPath)) return;
  let blogsContent = fs.readFileSync(blogsPath, 'utf-8');
  if (blogsContent.includes(topic.slug + '.html')) return;
  const newCard = `\n    <a href="${topic.slug}.html" class="acard reveal" data-cat="${topic.catTag}" data-search="${topic.searchTerms}">
      <div class="acard-thumb"><div class="acard-thumb-bg" style="background:${topic.gradient}"></div><span class="acard-badge" style="background:rgba(126,211,160,.85);color:#08060E">🆕 NEW</span><span class="acard-thumb-icon">${topic.emoji}</span></div>
      <div class="acard-body"><span class="acard-cat">${topic.category}</span><div class="acard-title">${topic.title}</div><div class="acard-desc">SmartShaadi AI honest advice, Hinglish mein. ${date} update.</div></div>
    </a>`;
  const insertPoint = blogsContent.lastIndexOf('</a>\n    </div>');
  if (insertPoint === -1) return;
  blogsContent = blogsContent.slice(0, insertPoint + 4) + newCard + blogsContent.slice(insertPoint + 4);
  fs.writeFileSync(blogsPath, blogsContent, 'utf-8');
}

function updateSitemap(topic, date) {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return;
  let sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  const url = `https://smartshaadi.online/${topic.slug}.html`;
  if (sitemap.includes(url)) return;
  const newEntry = `\n  <url><loc>${url}</loc><lastmod>${date}</lastmod><priority>0.8</priority></url>`;
  sitemap = sitemap.replace('</urlset>', newEntry + '\n</urlset>');
  fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  const topic = getTopicForToday();
  const date = getTodayDate();
  const outputPath = path.join(__dirname, '..', topic.slug + '.html');

  if (fs.existsSync(outputPath) && process.env.FORCE_REGENERATE !== 'true') {
    console.log(`ℹ️ ${topic.slug}.html exists. Skipping.`);
    process.exit(0);
  }

  const apiKey = process.env.GROQ_API_KEY;
  const prompt = `Tu SmartShaadi.online ka expert content writer hai. Ek comprehensive wedding planning blog likhna hai.
TOPIC: ${topic.title}
KEY FOCUS: ${topic.keyFocus}
DATE: ${date}

REQUIREMENTS: 1500+ words, Hinglish, Expert Tone.
SECTIONS: Intro, Budget Overview, Comparison Table, Case Study (Bhopal), Day vs Night, Tool Promo, FAQ.
Use pure HTML tags only.`;

  try {
    console.log('📡 Calling Groq (Llama 3.3)...');
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      }, { headers: { 'Authorization': `Bearer ${apiKey}` } });

    const blogHtml = response.data.choices[0].message.content;
    const linkedHtml = injectInternalLinks(blogHtml, topic.slug, loadUrlMap());
    const finalHtml = wrapInTemplate(topic, linkedHtml, date);

    fs.writeFileSync(outputPath, finalHtml, 'utf-8');
    addToBlogsPage(topic, date);
    updateSitemap(topic, date);
    console.log('🎉 Done!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
