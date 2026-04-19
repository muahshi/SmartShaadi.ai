/**
 * SmartShaadi Auto-Blog Generator
 * File: scripts/generate-blog.js
 *
 * Features:
 * - Groq API (Llama 3.3) se 2500+ word Hinglish blog
 * - Double-layer markdown + HTML tag cleaning
 * - path.join(process.cwd()) se root-level file creation
 * - Internal linking from url-map.json
 * - blogs.html card auto-add
 * - sitemap.xml auto-update
 * - Full Delhi-blog matching design (drawer nav, gold theme)
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

// ─── SMARTSHAADI MODULES ──────────────────────────────────────────────────────
// Topics aur Schema generators — FILE KE TOP PE HONE CHAHIYE (hoisting issue avoid)
const { getNextTopic } = require('./topics.js');
const { buildAllSchemas } = require('./schema-generator.js');

// ─── TOPIC QUEUE ──────────────────────────────────────────────────────────────

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}


function loadUrlMap() {
  const p = path.join(__dirname, 'url-map.json');
  if (!fs.existsSync(p)) { console.warn('⚠️  url-map.json not found. Skipping internal linking.'); return {}; }
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

// ─── DOUBLE-LAYER CLEANING ────────────────────────────────────────────────────
/**
 * Layer 1: Markdown backticks strip karta hai (```html ... ```)
 * Layer 2: Redundant <html>, <head>, <body> tags remove karta hai
 * Layer 3: Author name sanitize karta hai
 */
function cleanAiResponse(raw) {
  let cleaned = raw;

  // Layer 1 — Markdown fences (```html ... ```)
  cleaned = cleaned.replace(/^```[\w]*\n?/gim, '');
  cleaned = cleaned.replace(/\n?```$/gim, '');
  cleaned = cleaned.trim();

  // Layer 2 — Full HTML document wrapper tags
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
  cleaned = cleaned.replace(/<html[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/html>/gi, '');
  cleaned = cleaned.replace(/<head[\s\S]*?<\/head>/gi, '');
  cleaned = cleaned.replace(/<body[^>]*>/gi, '');
  cleaned = cleaned.replace(/<\/body>/gi, '');

  // Layer 3 — CANONICAL FIX: www.smartshaadi.online → smartshaadi.online
  // Yeh sabse important fix hai — AI kabhi kabhi www likh deta hai
  cleaned = cleaned.replace(/https:\/\/www\.smartshaadi\.online/g, 'https://smartshaadi.online');
  cleaned = cleaned.replace(/http:\/\/www\.smartshaadi\.online/g, 'https://smartshaadi.online');
  cleaned = cleaned.replace(/http:\/\/smartshaadi\.online/g, 'https://smartshaadi.online');

  // Layer 4 — Personal name sanitization (koi personal naam nahi)
  cleaned = cleaned.replace(/Mubashir\s*Hasan/gi, 'SmartShaadi Team');
  cleaned = cleaned.replace(/AI Systems Architect/gi, 'SmartShaadi AI');
  cleaned = cleaned.replace(/AI Automation Architect/gi, 'SmartShaadi AI');

  // Layer 5 — AdSense tags (approved nahi hai abhi)
  cleaned = cleaned.replace(/<ins class="adsbygoogle"[\s\S]*?<\/ins>/gi, '');
  cleaned = cleaned.replace(/adsbygoogle\.push\(\{.*?\}\);?/gi, '');

  // Layer 6 — Remove any inline canonical/schema tags AI adds
  // Yeh template mein properly inject hote hain, AI ke nahi chahiye
  cleaned = cleaned.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
  cleaned = cleaned.replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '');

  return cleaned.trim();
}

// ─── INTERNAL LINKING ─────────────────────────────────────────────────────────
function injectInternalLinks(html, currentSlug, urlMap) {
  const MAX_LINKS = 8;
  let count = 0;
  const usedUrls = new Set();
  const usedKw = new Set();
  let result = html;

  const entries = Object.entries(urlMap)
    .filter(([url]) => !url.includes(currentSlug))
    .flatMap(([url, data]) => (data.keywords || []).map(kw => ({ url, kw, title: data.title })))
    .sort((a, b) => b.kw.length - a.kw.length);

  for (const { url, kw, title } of entries) {
    if (count >= MAX_LINKS) break;
    if (usedUrls.has(url) || usedKw.has(kw.toLowerCase())) continue;
    const safe = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Only match inside <p> tags, not inside existing <a> tags
    const re = new RegExp(`(?<![">\\w])(${safe})(?![^<]*<\\/a>)`, 'i');
    if (re.test(result)) {
      const rel = url.replace('https://smartshaadi.online', '');
      result = result.replace(re, `<a href="${rel}" title="${title}">$1</a>`);
      usedUrls.add(url); usedKw.add(kw.toLowerCase()); count++;
    }
  }
  console.log(`🔗 Internal links injected: ${count}`);
  return result;
}

// ─── MASTER TEMPLATE ──────────────────────────────────────────────────────────
/**
 * Delhi blog se exact matching structure:
 * - Sticky nav + hamburger (#hbg) + slide-out drawer (#drawer)
 * - Gold dark theme CSS variables
 * - Cormorant Garamond headings, Plus Jakarta Sans body
 * - Dark footer with all links
 */
function buildTemplate(topic, bodyHtml, date, schemaBlocks) {
  // CANONICAL: non-www hardcoded — www se Google ranking drop hoti hai
  const canonical = `https://smartshaadi.online/${topic.slug}.html`;
  // Verify no www crept in
  if (canonical.includes('www.')) {
    console.error('❌ CRITICAL: www found in canonical! This will break SEO.');
    process.exit(1);
  }
  const plainText = bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const metaDesc = plainText.slice(0, 155) + '...';

  // FAQ JSON-LD now handled by schema-generator.js
  // Remove any existing JSON-LD from AI response (schema-generator builds proper ones)
  const cleanBody = bodyHtml.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '').trim();

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
<meta property="og:title" content="${topic.title}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://smartshaadi.online/og-shaadi.jpg">
<meta property="og:site_name" content="Smart Shaadi AI">
<meta name="twitter:card" content="summary_large_image">
${schemaBlocks}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
/* ── CORE VARIABLES ─────────────────────────────────── */
:root{
  --gold:#C9A84C;--gold2:#E8C97A;
  --gold-bg:rgba(201,168,76,0.08);--gold-bd:rgba(201,168,76,0.22);
  --bg:#0A0800;--bg2:#100E00;--card:#111008;--card2:#1A1600;
  --text:#F5EFE0;--muted:#A89070;--dim:#5A4A30;
  --green:#4ADE80;--gr:#4ADE80;
  --r:12px;--tr:all .2s ease;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.75;font-size:16px;overflow-x:hidden}
a{color:var(--gold);text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;border-radius:var(--r)}

/* ── NAV ────────────────────────────────────────────── */
nav{
  background:rgba(10,8,0,0.95);backdrop-filter:blur(16px);
  position:sticky;top:0;z-index:200;
  padding:0 1.5rem;height:58px;
  display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--gold-bd);
}
.nav-logo{
  font-family:'Cormorant Garamond',serif;font-size:1.35rem;font-weight:600;
  color:var(--text);text-decoration:none;letter-spacing:.02em;
}
.nav-logo em{color:var(--gold);font-style:italic}
.nav-links{display:flex;gap:1.6rem;font-size:.82rem;font-weight:500}
.nav-links a{color:var(--muted);transition:var(--tr)}
.nav-links a:hover{color:var(--gold);text-decoration:none}
/* Hamburger */
#hbg{
  display:none;flex-direction:column;gap:5px;cursor:pointer;
  padding:.4rem;background:none;border:none;
}
#hbg span{
  width:22px;height:2px;background:var(--muted);
  border-radius:2px;transition:var(--tr);display:block;
}
#hbg.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
#hbg.open span:nth-child(2){opacity:0}
#hbg.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

/* ── DRAWER ─────────────────────────────────────────── */
#drawer{
  position:fixed;top:0;right:-320px;width:300px;height:100%;
  background:var(--card);border-left:1px solid var(--gold-bd);
  z-index:300;transition:right .3s cubic-bezier(.4,0,.2,1);
  overflow-y:auto;padding:2rem 1.5rem;
}
#drawer.open{right:0}
#drawer-overlay{
  display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);
  backdrop-filter:blur(4px);z-index:299;
}
#drawer-overlay.show{display:block}
.drw-logo{
  font-family:'Cormorant Garamond',serif;font-size:1.3rem;font-weight:600;
  color:var(--text);margin-bottom:2rem;
  padding-bottom:1rem;border-bottom:1px solid var(--gold-bd);
  display:flex;align-items:center;justify-content:space-between;
}
.drw-logo em{color:var(--gold);font-style:italic}
.drw-close{background:none;border:none;color:var(--muted);font-size:1.5rem;cursor:pointer;padding:.2rem}
.drw-close:hover{color:var(--gold)}
.drw-section{margin-bottom:1.4rem}
.drw-section-title{
  font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;
  color:var(--gold);font-weight:700;margin-bottom:.7rem;
}
.drw-section a{
  display:flex;align-items:center;gap:.6rem;
  padding:.5rem .6rem;border-radius:8px;
  font-size:.85rem;color:var(--muted);transition:var(--tr);
}
.drw-section a:hover{background:var(--gold-bg);color:var(--text);text-decoration:none}
.drw-section a .mi{font-size:1rem}

/* ── LAYOUT ─────────────────────────────────────────── */
.container{max-width:780px;margin:0 auto;padding:2rem 1.5rem}

/* ── BLOG HERO ──────────────────────────────────────── */
.blog-hero{padding:2.5rem 0 1.5rem;border-bottom:1px solid var(--gold-bd);margin-bottom:2rem}
.blog-cat{
  display:inline-block;background:var(--gold-bg);border:1px solid var(--gold-bd);
  color:var(--gold);font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;
  padding:.28rem .85rem;border-radius:100px;margin-bottom:1rem;font-weight:600;
}
.blog-hero h1{
  font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:700;
  line-height:1.25;margin-bottom:1rem;
}
.blog-hero h1 em{color:var(--gold);font-style:italic}
.blog-meta{display:flex;gap:1rem;flex-wrap:wrap;font-size:.78rem;color:var(--muted)}

/* ── BLOG CONTENT ───────────────────────────────────── */
.blog-content{font-size:.97rem;line-height:1.85;color:#E8DDD0}
.blog-content h2{
  font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;
  color:var(--text);margin:2.5rem 0 1rem;
  padding-bottom:.5rem;border-bottom:1px solid var(--gold-bd);
}
.blog-content h3{font-size:1.05rem;font-weight:700;color:var(--gold);margin:1.8rem 0 .7rem}
.blog-content p{margin-bottom:1.2rem}
.blog-content ul,.blog-content ol{margin:1rem 0 1.2rem 1.5rem}
.blog-content li{margin-bottom:.6rem}
.blog-content strong{color:var(--text);font-weight:700}
.blog-content a{color:var(--gold);border-bottom:1px solid rgba(201,168,76,.3)}
.blog-content a:hover{border-bottom-color:var(--gold);text-decoration:none}

/* ── TABLE ──────────────────────────────────────────── */
table{width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:.88rem}
th{
  background:var(--gold-bg);color:var(--gold);
  padding:.7rem 1rem;text-align:left;
  font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;
  border-bottom:1px solid var(--gold-bd);
}
td{padding:.65rem 1rem;border-bottom:1px solid rgba(255,255,255,.05);color:var(--muted)}
tr:hover td{background:rgba(201,168,76,.03)}

/* ── CASE STUDY ─────────────────────────────────────── */
.case-study{
  background:linear-gradient(135deg,rgba(201,168,76,.08),rgba(201,168,76,.02));
  border-left:3px solid var(--gold);
  padding:1.4rem 1.6rem;border-radius:0 var(--r) var(--r) 0;margin:2rem 0;
}
.cs-label{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:.6rem}
.case-study h3{font-size:1rem;margin-bottom:.7rem;color:var(--text)}
.case-study p{font-size:.9rem;color:var(--muted);margin:0;line-height:1.75}
.case-study em{color:var(--text);font-style:italic}

/* ── HIGHLIGHT BOX ──────────────────────────────────── */
.highlight-box{
  background:var(--gold-bg);border:1px solid var(--gold-bd);
  border-radius:var(--r);padding:1.4rem 1.6rem;margin:2rem 0;
}
.highlight-box .box-label{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:.5rem}
.highlight-box p{margin:0;font-size:.92rem;color:var(--text)}

/* ── TOOL PROMO ─────────────────────────────────────── */
.tool-promo{
  background:linear-gradient(135deg,rgba(201,168,76,.12),rgba(201,168,76,.03));
  border:1px solid var(--gold-bd);border-radius:var(--r);
  padding:1.4rem 1.6rem;margin:2.5rem 0;
  display:flex;align-items:center;gap:1.2rem;flex-wrap:wrap;
}
.tp-text{flex:1;min-width:200px}
.tp-label{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:.4rem}
.tp-text h4{font-size:1rem;margin-bottom:.35rem;color:var(--text)}
.tp-text p{font-size:.84rem;color:var(--muted);margin:0}
.tp-btn{
  background:var(--gold);color:#0A0800;padding:.75rem 1.4rem;
  border-radius:8px;font-size:.85rem;font-weight:700;
  white-space:nowrap;text-decoration:none;transition:var(--tr);
}
.tp-btn:hover{opacity:.9;text-decoration:none}

/* ── AD SLOT (prepared) ─────────────────────────────── */
.ad-slot{
  background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.06);
  border-radius:var(--r);padding:1.5rem;margin:2rem 0;
  text-align:center;min-height:90px;display:flex;align-items:center;justify-content:center;
}
.ad-slot-label{font-size:.65rem;color:rgba(255,255,255,.2);letter-spacing:.1em;text-transform:uppercase}

/* ── FAQ ────────────────────────────────────────────── */
.faq-section{margin:2.5rem 0}
.faq-section h2{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:700;margin-bottom:1.2rem}
.faq-item{border-bottom:1px solid rgba(255,255,255,.07);padding:.9rem 0}
.faq-q{
  width:100%;text-align:left;background:none;border:none;cursor:pointer;
  display:flex;justify-content:space-between;align-items:center;
  font-size:.93rem;font-weight:600;color:var(--text);
  font-family:'Plus Jakarta Sans',sans-serif;padding:.2rem 0;gap:1rem;
}
.faq-icon{color:var(--gold);font-size:1.2rem;min-width:20px;transition:var(--tr)}
.faq-item.open .faq-icon{transform:rotate(45deg)}
.faq-a{display:none;padding:.6rem 0 .3rem;font-size:.87rem;line-height:1.8;color:var(--muted)}
.faq-item.open .faq-a{display:block}

/* ── RELATED ────────────────────────────────────────── */
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.8rem;margin-top:1rem}
.related-card{
  background:var(--card);border:1px solid rgba(255,255,255,.07);
  border-radius:10px;padding:1rem;display:flex;align-items:center;gap:.8rem;
  text-decoration:none;color:inherit;transition:var(--tr);
}
.related-card:hover{border-color:var(--gold-bd);text-decoration:none}

/* ── FOOTER ─────────────────────────────────────────── */
footer{
  background:#070600;border-top:1px solid var(--gold-bd);
  padding:2.5rem 1.5rem 2rem;margin-top:3rem;
}
.footer-inner{max-width:1100px;margin:0 auto}
.footer-top{
  display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:2rem;
  margin-bottom:2rem;padding-bottom:2rem;border-bottom:1px solid var(--gold-bd);
}
.footer-brand .fb-logo{font-family:'Cormorant Garamond',serif;font-size:1.2rem;font-weight:600;color:var(--text);margin-bottom:.5rem}
.footer-brand .fb-logo em{color:var(--gold);font-style:italic}
.footer-brand p{font-size:.78rem;color:var(--muted);line-height:1.7;margin-top:.4rem}
.footer-col h4{font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:.8rem}
.footer-col a{display:block;font-size:.8rem;color:var(--muted);margin-bottom:.4rem;transition:var(--tr)}
.footer-col a:hover{color:var(--gold);text-decoration:none}
.footer-bottom{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.8rem}
.footer-bottom p{font-size:.75rem;color:var(--dim)}
.footer-bottom-links{display:flex;gap:1.2rem}
.footer-bottom-links a{font-size:.75rem;color:var(--dim);transition:var(--tr)}
.footer-bottom-links a:hover{color:var(--gold)}

/* ── RESPONSIVE ─────────────────────────────────────── */
@media(max-width:768px){
  .nav-links{display:none}
  #hbg{display:flex}
  .blog-hero h1{font-size:1.6rem}
  .footer-top{grid-template-columns:1fr 1fr}
  .footer-brand{grid-column:1/-1}
}
@media(max-width:500px){
  .blog-hero h1{font-size:1.4rem}
  .footer-top{grid-template-columns:1fr}
  .container{padding:1.5rem 1rem}
  table{font-size:.8rem}
  td,th{padding:.5rem .6rem}
}
</style>
</head>
<body>

<!-- ── NAV ──────────────────────────────────────────────────────────── -->
<nav>
  <a href="/" class="nav-logo">Smart<em>Shaadi</em> 💍</a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/ai-tools.html">AI Tools</a>
    <a href="/blogs.html">Blog</a>
    <a href="/vendors/index.html">Vendors</a>
    <a href="/about.html">About</a>
    <a href="/contact.html">Contact</a>
  </div>
  <button id="hbg" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<!-- ── DRAWER OVERLAY ────────────────────────────────────────────────── -->
<div id="drawer-overlay" onclick="closeDrw()"></div>

<!-- ── SLIDE-OUT DRAWER ──────────────────────────────────────────────── -->
<div id="drawer">
  <div class="drw-logo">
    <span>Smart<em>Shaadi</em> 💍</span>
    <button class="drw-close" onclick="closeDrw()">✕</button>
  </div>

  <div class="drw-section">
    <div class="drw-section-title">Main Pages</div>
    <a href="/" onclick="closeDrw()"><span class="mi">🏠</span> Home</a>
    <a href="/app.html" onclick="closeDrw()"><span class="mi">📊</span> Wedding Dashboard</a>
    <a href="/blogs.html" onclick="closeDrw()"><span class="mi">📖</span> Magazine & Blogs</a>
    <a href="/about.html" onclick="closeDrw()"><span class="mi">💡</span> About Us</a>
    <a href="/contact.html" onclick="closeDrw()"><span class="mi">📬</span> Contact</a>
  </div>

  <div class="drw-section">
    <div class="drw-section-title">Free AI Tools</div>
    <a href="/ai-invitation-writer.html" onclick="closeDrw()"><span class="mi">💌</span> AI Invitation Writer</a>
    <a href="/ai-kundali-matching.html" onclick="closeDrw()"><span class="mi">🔮</span> AI Kundali Matching</a>
    <a href="/ai-budget-calculator.html" onclick="closeDrw()"><span class="mi">💰</span> AI Budget Calculator</a>
    <a href="/ai-playlist-generator.html" onclick="closeDrw()"><span class="mi">🎵</span> AI Playlist Generator</a>
    <a href="/ai-menu-planner.html" onclick="closeDrw()"><span class="mi">🍽️</span> AI Menu Planner</a>
    <a href="/ai-photography-shots.html" onclick="closeDrw()"><span class="mi">📸</span> Photography Shots</a>
    <a href="/ai-wedding-theme-generator.html" onclick="closeDrw()"><span class="mi">🎨</span> AI Theme Generator</a>
    <a href="/ai-guest-manager.html" onclick="closeDrw()"><span class="mi">👥</span> AI Guest Manager</a>
    <a href="/wedding-vendor-negotiation-bot.html" onclick="closeDrw()"><span class="mi">🤝</span> Vendor Negotiation Bot</a>
    <a href="/chatbot.html" onclick="closeDrw()"><span class="mi">🤖</span> AI Chatbot</a>
    <a href="/ai-budget-optimizer.html" onclick="closeDrw()"><span class="mi">⚡</span> Budget Optimizer</a>
    <a href="/ai-vendor-price-predictor.html" onclick="closeDrw()"><span class="mi">📊</span> Price Predictor</a>
    <a href="/ai-hidden-cost-detector.html" onclick="closeDrw()"><span class="mi">🔍</span> Hidden Cost Detector</a>
  </div>

  <div class="drw-section">
    <div class="drw-section-title">Budget Guides</div>
    <a href="/blog-budget-2026.html" onclick="closeDrw()"><span class="mi">💰</span> Budget Guide 2026</a>
    <a href="/wedding-budget-calculator-india-2026.html" onclick="closeDrw()"><span class="mi">🧮</span> Budget Calculator</a>
    <a href="/blog-wedding-saving-tips.html" onclick="closeDrw()"><span class="mi">💡</span> Saving Tips</a>
  </div>

  <div class="drw-section">
    <div class="drw-section-title">Legal</div>
    <a href="/privacy-policy.html" onclick="closeDrw()"><span class="mi">🔒</span> Privacy Policy</a>
    <a href="/terms.html" onclick="closeDrw()"><span class="mi">📄</span> Terms & Conditions</a>
  </div>
</div>

<!-- ── MAIN CONTENT ───────────────────────────────────────────────────── -->
<div class="container">
  <div class="blog-hero">
    <div class="blog-cat">📍 ${topic.category}</div>
    <h1>${topic.title}</h1>
    <div class="blog-meta">
      <span>📅 ${date}</span>
      <span>⏱️ ${topic.readTime}</span>
      <span>✍️ SmartShaadi AI Team</span>
    </div>
  </div>

  <!-- AD SLOT TOP -->
  <div class="ad-slot"><span class="ad-slot-label">Advertisement</span></div>

  <div class="blog-content">
${cleanBody}
  </div>

  <!-- AD SLOT BOTTOM -->
  <div class="ad-slot"><span class="ad-slot-label">Advertisement</span></div>

  <!-- RELATED ARTICLES -->
  <div style="margin:2.5rem 0;padding-top:2rem;border-top:1px solid var(--gold-bd)">
    <div style="font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem;font-weight:700">Yeh Bhi Padhein</div>
    <div class="related-grid">
      <a href="/blog-budget-2026.html" class="related-card">
        <span style="font-size:1.5rem">💰</span>
        <div><strong style="display:block;font-size:.85rem">Wedding Budget Guide 2026</strong><span style="font-size:.75rem;color:var(--muted)">Complete India guide</span></div>
      </a>
      <a href="${topic.relatedTool.href}" class="related-card">
        <span style="font-size:1.5rem">🛠️</span>
        <div><strong style="display:block;font-size:.85rem">${topic.relatedTool.name}</strong><span style="font-size:.75rem;color:var(--muted)">${topic.relatedTool.desc}</span></div>
      </a>
      <a href="/wedding-vendor-negotiation-bot.html" class="related-card">
        <span style="font-size:1.5rem">🤝</span>
        <div><strong style="display:block;font-size:.85rem">Vendor Negotiation Bot</strong><span style="font-size:.75rem;color:var(--muted)">Scripts + tips free</span></div>
      </a>
    </div>
  </div>
</div>

<!-- ── FOOTER ────────────────────────────────────────────────────────── -->
<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <div class="fb-logo">Smart<em>Shaadi</em> 💍</div>
        <p>India ka #1 Free AI Wedding Planner. Technology aur tradition ka perfect milan — aapki dream shaadi ke liye.</p>
        <p style="margin-top:.5rem;font-size:.75rem;color:var(--dim)">⭐⭐⭐⭐⭐ India's #1 AI Wedding Planner</p>
      </div>
      <div class="footer-col">
        <h4>AI Tools</h4>
        <a href="/ai-invitation-writer.html">Invitation Writer</a>
        <a href="/ai-kundali-matching.html">Kundali Matching</a>
        <a href="/ai-budget-calculator.html">Budget Calculator</a>
        <a href="/ai-menu-planner.html">Menu Planner</a>
        <a href="/ai-tools.html">All 13 Tools →</a>
      </div>
      <div class="footer-col">
        <h4>Top Guides</h4>
        <a href="/blog-budget-2026.html">Budget 2026</a>
        <a href="/blog-delhi-wedding-cost-2026.html">Delhi Wedding</a>
        <a href="/blog-mumbai-wedding-cost-2026.html">Mumbai Wedding</a>
        <a href="/blog-wedding-checklist.html">Checklist</a>
        <a href="/blogs.html">All Blogs →</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="/about.html">About Us</a>
        <a href="/contact.html">Contact</a>
        <a href="/vendors/index.html">Vendors</a>
        <a href="/vendors/apply.html">List Business</a>
        <a href="/privacy-policy.html">Privacy Policy</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} SmartShaadi.online — All rights reserved</p>
      <div class="footer-bottom-links">
        <a href="/privacy-policy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="/contact.html">Contact</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </div>
  </div>
</footer>

<!-- ── SCRIPTS ───────────────────────────────────────────────────────── -->
<script>
// Hamburger + Drawer
var hbg = document.getElementById('hbg');
var drw = document.getElementById('drawer');
var overlay = document.getElementById('drawer-overlay');

function openDrw() {
  drw.classList.add('open');
  overlay.classList.add('show');
  hbg.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrw() {
  drw.classList.remove('open');
  overlay.classList.remove('show');
  hbg.classList.remove('open');
  document.body.style.overflow = '';
}
hbg.addEventListener('click', function() {
  drw.classList.contains('open') ? closeDrw() : openDrw();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeDrw();
});

// FAQ Accordion
document.querySelectorAll('.faq-q').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item = this.parentElement;
    var wasOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
    // Toggle current
    if (!wasOpen) item.classList.add('open');
  });
});

// SS_PRO safe wrapper
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

// ─── UPDATE blogs.html ────────────────────────────────────────────────────────
function addToBlogsPage(topic, date) {
  const p = path.join(process.cwd(), 'blogs.html');
  if (!fs.existsSync(p)) { console.warn('⚠️  blogs.html not found.'); return; }
  let html = fs.readFileSync(p, 'utf-8');

  // Already exists check
  if (html.includes(topic.slug + '.html')) {
    console.log('ℹ️  Card already in blogs.html — skipping.');
    return;
  }
  console.log(`📝 Adding card for: ${topic.slug}`);

  const card = `
    <a href="${topic.slug}.html" class="acard reveal" data-cat="${topic.catTag}" data-search="${topic.searchTerms}">
      <div class="acard-thumb"><div class="acard-thumb-bg" style="background:${topic.gradient}"></div><span class="acard-badge" style="background:rgba(126,211,160,.85);color:#08060E">🆕 NEW</span><span class="acard-thumb-icon">${topic.emoji}</span><div class="acard-thumb-overlay">${topic.category} • ${topic.readTime}</div></div>
      <div class="acard-body"><span class="acard-cat">${topic.category}</span><div class="acard-title">${topic.title}</div><div class="acard-desc">SmartShaadi AI Team ka in-depth guide — real data, honest pricing, Hinglish mein. Published ${date}.</div><div class="acard-footer"><div class="acard-read">Read Guide →</div><div class="acard-meta">${topic.readTime}</div></div></div>
    </a>`;

  // Try multiple insertion patterns — order matters (most specific first)
  const PATTERNS = [
    '<!-- END NEW BLOGS -->',   // Primary: explicit marker in your blogs.html
    '</a>\n    <!-- END',       // Variant with newline before comment
    '</a>\n\n<footer',         // Fallback: before footer
    '</a>\n<footer',            // Fallback variant
  ];

  let inserted = false;
  for (const pattern of PATTERNS) {
    const idx = html.lastIndexOf(pattern);
    if (idx !== -1) {
      // Insert card BEFORE the found pattern
      html = html.slice(0, idx) + card + '\n    ' + html.slice(idx);
      inserted = true;
      console.log(`✅ Inserted using pattern: "${pattern.replace(/\n/g, '\\n')}"`);
      break;
    }
  }

  if (!inserted) {
    // Last resort: insert before </footer>
    const footerIdx = html.lastIndexOf('<footer');
    if (footerIdx !== -1) {
      html = html.slice(0, footerIdx) + card + '\n\n' + html.slice(footerIdx);
      inserted = true;
      console.log('✅ Inserted before <footer> (last resort)');
    } else {
      console.error('❌ Could not find insertion point in blogs.html!');
      console.error('   Add <!-- END NEW BLOGS --> comment before </footer> in blogs.html');
      return;
    }
  }

  fs.writeFileSync(p, html, 'utf-8');
  console.log('✅ blogs.html updated successfully');
}

// ─── UPDATE sitemap.xml ───────────────────────────────────────────────────────
function updateSitemap(topic, date) {
  const p = path.join(process.cwd(), 'sitemap.xml');
  if (!fs.existsSync(p)) { console.warn('⚠️  sitemap.xml not found.'); return; }
  let sm = fs.readFileSync(p, 'utf-8');
  const url = `https://smartshaadi.online/${topic.slug}.html`;
  if (sm.includes(url)) {
    console.log(`ℹ️  URL already in sitemap: ${url}`);
    return;
  }
  console.log(`📍 Adding to sitemap: ${url}`);
  const entry = `\n  <url>\n    <loc>${url}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  sm = sm.replace('</urlset>', entry + '\n</urlset>');
  fs.writeFileSync(p, sm, 'utf-8');
  console.log('✅ sitemap.xml updated');
}

// ─── UPDATE url-map.json ──────────────────────────────────────────────────────
function updateUrlMap(topic) {
  const p = path.join(__dirname, 'url-map.json');
  const map = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : {};
  const url = `https://smartshaadi.online/${topic.slug}.html`;
  if (!map[url]) {
    map[url] = { slug: topic.slug, title: topic.title, keywords: topic.searchTerms.split(' ').filter(w => w.length > 4).slice(0, 5) };
    fs.writeFileSync(p, JSON.stringify(map, null, 2), 'utf-8');
    console.log('✅ url-map.json updated');
  }
}

// ─── GROQ API CALL ────────────────────────────────────────────────────────────
function callGroqApi(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4096,
      temperature: 0.75,
      messages: [
        {
          role: 'system',
          content: `Tu SmartShaadi.online ka senior Hinglish content writer hai. 
Tera background automation aur AI systems mein hai.
Teri writing style: Expert friend ki tarah — warm, specific, practical.
Tu hamesha SmartShaadi Team ki taraf se likhta hai — koi personal naam nahi.
HTML output deta hai — koi markdown backticks nahi, koi \`\`\`html nahi.
Sirf body content deta hai — <html>, <head>, <body>, <nav>, <footer> tags bilkul nahi.`
        },
        { role: 'user', content: prompt }
      ]
    });

    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(`Groq API Error: ${parsed.error.message}`));
          const content = parsed.choices?.[0]?.message?.content;
          if (!content) return reject(new Error('Empty response from Groq API'));
          resolve(content);
        } catch (e) { reject(new Error(`JSON parse failed: ${e.message}\nRaw: ${data.slice(0, 200)}`)); }
      });
    });

    req.on('error', reject);
    req.setTimeout(90000, () => { req.destroy(); reject(new Error('Groq API timeout (90s)')); });
    req.write(body);
    req.end();
  });
}

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────
function buildPrompt(topic, date) {
  return `⚠️ CANONICAL RULE (MOST IMPORTANT): 
Koi bhi URL likhte waqt SIRF https://smartshaadi.online/ use karo.
www.smartshaadi.online kabhi nahi — yeh Google ranking ke liye haanikaarak hai.
Koi <link rel="canonical">, <meta og:url> tags mat likho — yeh alag se inject honge.

Topic: ${topic.title}
Date: ${date}
Key Focus: ${topic.keyFocus}
Case Study City: ${topic.caseStudyCity}

Ek detailed 2500+ word wedding planning blog likho. PURE HTML OUTPUT chahiye — koi markdown nahi, koi backticks nahi.

MANDATORY FORMAT:

<p>[Compelling 2-3 para introduction — specific problem se shuru karo jo Indian couples face karte hain is topic mein. Personal aur relatable tone.]</p>

<h2>[Topic] 2026 — Quick Stats aur Overview</h2>
<div class="highlight-box">
  <div class="box-label">📊 2026 Key Numbers</div>
  <p>[3-4 specific statistics jo is topic se related hain — real-sounding data]</p>
</div>

<h2>Complete Budget Breakdown — 2026 Real Figures</h2>
<p>[2-3 para explanation]</p>
<table>
  <thead><tr><th>Category</th><th>Budget Option</th><th>Mid-Range</th><th>Premium</th></tr></thead>
  <tbody>
    [7-10 rows with real Indian price data]
  </tbody>
</table>

<div class="case-study">
  <div class="cs-label">✦ Personal Experience — ${topic.caseStudyCity}</div>
  <h3>[Realistic Indian couple names] — ${topic.caseStudyCity}, [Month] 2026</h3>
  <p>[IMPORTANT: Yeh case study ek AI systems background wale insaan ki perspective se likho — jaise kisi ne apni behen ya friend ki shaadi ke liye AI automation tools use karke planning ki. Specific automation insights include karo — kaise spreadsheets replace hue, vendor data compare kiya, SMS automation se reminders bheje. Real feel do — jaise kisi genuine experience se likh rahe ho. Specific numbers: kitna bachaya, kaunsa tool use kiya, kya result aaya. End mein ek genuine quote in quotes — jaise ek real insaan bol raha ho.]</p>
</div>

<h2>Day vs Night — Kya Fark Padta Hai?</h2>
<p>[Intro para]</p>
<table>
  <thead><tr><th>Factor</th><th>Day Wedding</th><th>Night Wedding</th></tr></thead>
  <tbody>
    [6-8 specific comparison rows with price differences]
  </tbody>
</table>
<p>[Recommendation para — kab kya better hota hai]</p>

<h2>[Topic-specific H2 — city-wise ya category-wise breakdown]</h2>
<p>[Detailed content]</p>
[Another table if relevant]

<h2>[Another relevant H2 — tips, guide, negotiation]</h2>
[Detailed list ya paragraphs with practical advice]

<h2>Kahan Galti Karte Hain Log — 5 Common Mistakes</h2>
<p>[Intro]</p>
<ul>
  [5 specific, numbered mistakes with brief explanation each]
</ul>

<h2>Hidden Costs Jo Quote Mein Nahi Hote</h2>
<ul>
  [6-8 specific hidden costs with amounts — Indian context]
</ul>

<h2>SmartShaadi AI Se Kaise Plan Karein</h2>
<p>[How to use SmartShaadi tools for this specific topic — 2-3 para, practical steps]</p>

<h2>Conclusion — Smarter Decision Ki Taraf</h2>
<p>[2-3 para wrap up with specific actionable advice — positive, empowering tone]</p>

<div class="faq-section">
<h2>❓ Aksar Poochhe Jaane Wale Sawaal</h2>
<div class="faq-item"><button class="faq-q">[Question 1 about topic]? <span class="faq-icon">+</span></button><div class="faq-a">[Detailed answer with specific numbers/data]</div></div>
<div class="faq-item"><button class="faq-q">[Question 2 about topic]? <span class="faq-icon">+</span></button><div class="faq-a">[Detailed answer]</div></div>
<div class="faq-item"><button class="faq-q">[Question 3 about topic]? <span class="faq-icon">+</span></button><div class="faq-a">[Detailed answer]</div></div>
<div class="faq-item"><button class="faq-q">[Question 4 about topic]? <span class="faq-icon">+</span></button><div class="faq-a">[Detailed answer]</div></div>
<div class="faq-item"><button class="faq-q">[Question 5 about topic]? <span class="faq-icon">+</span></button><div class="faq-a">[Detailed answer]</div></div>
</div>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"[Q1]","acceptedAnswer":{"@type":"Answer","text":"[A1 short]"}},
{"@type":"Question","name":"[Q2]","acceptedAnswer":{"@type":"Answer","text":"[A2 short]"}},
{"@type":"Question","name":"[Q3]","acceptedAnswer":{"@type":"Answer","text":"[A3 short]"}}
]}
</script>

STRICT RULES — ZERO TOLERANCE:
1. LANGUAGE: Hinglish (Hindi + English natural mix, jaise Indians bolte hain)
2. WORD COUNT: MINIMUM 2500 words — count carefully, short response acceptable nahi
3. AUTHOR: Sirf "SmartShaadi Team" — koi personal naam nahi, koi personal pronoun nahi
4. PRICES: Hamesha ₹ symbol use karo (Rs. ya INR nahi)
5. URLs: Agar koi URL likhni ho toh SIRF https://smartshaadi.online/ — www BILKUL NAHI
6. CANONICAL RULE: www.smartshaadi.online kabhi nahi likhna — yeh site ranking ke liye haanikaarak hai
7. HTML ONLY: NO markdown backticks (\`\`\`html), NO <html>, NO <head>, NO <body>, NO <nav>, NO <footer>
8. SCHEMA: Koi bhi JSON-LD mat likho — schema alag se inject hoga
9. INLINE META: Koi <link rel="canonical">, <meta og:> tags mat likho
10. DATA: Real-sounding specific numbers — generic "varies" type answers acceptable nahi`;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 SmartShaadi Auto-Blog Generator (Groq Edition)\n');

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('❌ GROQ_API_KEY environment variable not set! Add it to GitHub Secrets.');

  const topic = await getNextTopic(apiKey);
  const date  = getTodayDate();

  // ── path.join(process.cwd()) — GitHub Actions root se resolve ──
  const outputPath = path.join(process.cwd(), topic.slug + '.html');

  // Force check — only reached if topic explicitly selected via override
  const force = process.env.FORCE_REGENERATE === 'true';
  if (fs.existsSync(outputPath) && !force) {
    // Topic already exists — but getTopicForToday() should have avoided this
    // Extra safety: try to find next ungenerated topic
    console.log(`⚠️  ${topic.slug}.html already exists even after smart selection!`);
    console.log('   This means all topics in queue are generated.');
    console.log('   Add new topics to MANUAL_TOPICS array in scripts/topics.js');
    process.exit(0);
  }

  console.log(`📝 Topic    : ${topic.title}`);
  console.log(`📅 Date     : ${date}`);
  console.log(`📂 Output   : ${outputPath}`);
  console.log(`🏙️  Case City: ${topic.caseStudyCity}\n`);

  // ── GROQ API CALL ─────────────────────────────────────────────────
  console.log('📡 Calling Groq API (Llama 3.3)...');
  const prompt = buildPrompt(topic, date);
  const rawHtml = await callGroqApi(prompt, apiKey);
  console.log(`✅ Response received: ${rawHtml.length} chars`);

  // ── DOUBLE-LAYER CLEANING ──────────────────────────────────────────
  console.log('🧹 Cleaning AI response (double-layer)...');
  const cleanedHtml = cleanAiResponse(rawHtml);
  const wordCount = cleanedHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`📊 Word count: ~${wordCount} words`);
  if (wordCount < 1000) console.warn('⚠️  Low word count! Blog may be incomplete.');

  // ── INTERNAL LINKING ───────────────────────────────────────────────
  console.log('🔗 Injecting internal links...');
  const urlMap = loadUrlMap();
  const linkedHtml = injectInternalLinks(cleanedHtml, topic.slug, urlMap);


  // ── FINAL URL SAFETY PASS ────────────────────────────────────────────────
  // Double-check: agar koi www URL reh gayi ho toh hata do
  const safeLinkedHtml = linkedHtml
    .replace(/https:\/\/www\.smartshaadi\.online/g, 'https://smartshaadi.online')
    .replace(/http:\/\/smartshaadi\.online/g, 'https://smartshaadi.online');

  // ── GENERATE ALL SCHEMAS ─────────────────────────────────────────────────
  console.log('📊 Generating JSON-LD schemas (Article + FAQ + HowTo + SoftwareApp)...');
  const schemaBlocks = buildAllSchemas(topic, safeLinkedHtml, date);

  // ── WRAP IN MASTER TEMPLATE ──────────────────────────────────────────────
  console.log('🏗️  Building final HTML with master template...');
  const finalHtml = buildTemplate(topic, safeLinkedHtml, date, schemaBlocks);

  // ── SAVE HTML FILE (process.cwd() = repo root in GitHub Actions) ───
  fs.writeFileSync(outputPath, finalHtml, 'utf-8');
  const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`✅ File saved: ${topic.slug}.html (${sizeKb} KB)`);

  // ── UPDATE SUPPORTING FILES ────────────────────────────────────────
  addToBlogsPage(topic, date);
  updateSitemap(topic, date);
  updateUrlMap(topic);

  console.log('\n🎉 Auto-blog generation complete!');
  console.log(`🔗 Live URL: https://smartshaadi.online/${topic.slug}.html`);
  console.log('🚀 Vercel will deploy automatically after git push.\n');
}

main().catch(err => {
  console.error('\n❌ FATAL ERROR:', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});


