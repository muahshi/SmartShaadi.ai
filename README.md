# 💍 Smart Shaadi AI — India's #1 Free AI Wedding Planner

**Smart Shaadi AI** is a free, AI-powered wedding planning platform built for Indian couples. It combines powerful planning tools with a beautiful UI — helping couples plan their dream shaadi stress-free, in Hindi or English, at zero cost.

![Version](https://img.shields.io/badge/Version-3.0-gold)
![Tech](https://img.shields.io/badge/Tech-Vanilla_JS-orange)
![AI](https://img.shields.io/badge/AI-Claude_Sonnet-blue)
![License](https://img.shields.io/badge/License-Proprietary-red)
![Pages](https://img.shields.io/badge/Pages-80+-green)
![Tools](https://img.shields.io/badge/AI_Tools-13_Free-gold)

## 🚀 Live Site
**[smartshaadi.online](https://smartshaadi.online)**

---

## ✨ Features

### 🤖 13 Free AI Tools

| Tool | File | Description |
|------|------|-------------|
| 💌 AI Invitation Writer | ai-invitation-writer.html | 8 styles, 6 languages (Hindi, English, Hinglish, Urdu, Marathi, Punjabi) |
| 🔮 AI Kundali Matching | ai-kundali-matching.html | 36 Guna Milan, Mangal Dosha, Nadi Dosha analysis |
| 💰 AI Budget Calculator | ai-budget-calculator.html | City-wise budget breakdown with savings tips |
| 🎵 AI Playlist Generator | ai-playlist-generator.html | Ceremony-wise Bollywood song suggestions |
| 🍽️ AI Menu Planner | ai-menu-planner.html | 10 regional cuisines, quantity calculator, caterer brief |
| 📸 AI Photography Shots | ai-photography-shots.html | 100+ shot list with pose directions |
| 🎨 AI Theme Generator | ai-wedding-theme-generator.html | Theme, HEX color palette, mood board |
| 👥 AI Guest Manager | ai-guest-manager.html | Guest list, RSVP tracking, WhatsApp invite sender |
| 📅 AI Planning Timeline | ai-planning-timeline.html | 9-milestone countdown from today to wedding day |
| 💬 WhatsApp Invite Generator | whatsapp-invite-generator.html | 6 languages, 8 styles, bulk sender |
| 🧮 Budget Calculator 2026 | wedding-budget-calculator-india-2026.html | 15 cities, donut chart, AI saving tips |
| ✈️ Destination Calculator | destination-wedding-calculator-india-2026.html | 8 destinations, travel + stay + venue cost |
| 🤝 Vendor Negotiation Bot | wedding-vendor-negotiation-bot.html | Hinglish scripts, 20-30% savings |

### 🛠️ Free Planning Dashboard (app.html)
- **Budget Splitter** — Auto-splits budget into Venue, Catering, Decor, Photography, Music, Misc
- **Guest Manager** — Track guests, meal preferences, RSVP status, per-plate cost
- **RSVP Tracker** — Live confirmed/pending/declined count with catering estimate
- **Venue Comparison** — Compare multiple venues by cost, capacity, rating
- **Timeline Generator** — Enter wedding date → get 9 auto-generated milestones
- **Overview Dashboard** — Live stats: budget, guests, confirmed RSVPs, best venue, tasks left

### 💬 AI Chatbot (chatbot.html)
- Hindi + English (Hinglish) support
- Powered by **Anthropic Claude API**
- Complete wedding planning assistance 24/7
- No login required, 100% free

### 📖 Magazine (blogs.html)
- 60+ expert articles on budget, venues, city guides, shopping, decor, AI hacks
- City-specific guides: Delhi, Mumbai, Bangalore, Hyderabad, Pune, Bhopal, Jaipur
- Real couple case studies in every article
- FAQ schema on every page for Google rich results
- Search + category filter

### 🏪 Vendor Directory (vendors/)
- Verified wedding vendors across India
- Categories: Photography, Catering, Decoration, DJ, Makeup
- Vendor listing plans: Basic (₹999/mo), Featured (₹1,999/mo), Premium (₹2,999/mo)

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Pure HTML5, CSS3, Vanilla JavaScript (ES6) |
| AI Backend | Anthropic Claude API (claude-sonnet-4-20250514) |
| Hosting | Vercel (auto-deploy from GitHub) |
| DNS | Vercel DNS (via Hostinger domain) |
| Analytics | Google Analytics 4 (G-Y6QPBQ6QZE) |
| Fonts | Google Fonts (Cormorant Garamond, DM Sans, Plus Jakarta Sans) |
| PWA | manifest.json + sw.js (offline support) |
| Language | hi-IN / en-IN |

**Zero external UI dependencies** — no jQuery, no Bootstrap, no React. Pure vanilla stack for maximum performance.

---

## 📁 Project Structure

```
smartshaadi.online/
│
├── CORE PAGES
│   ├── index.html                          # Homepage
│   ├── app.html                            # Wedding Planning Dashboard (PWA)
│   ├── dashboard.html                      # Full Dashboard
│   ├── blogs.html                          # Magazine (60+ articles)
│   ├── ai-tools.html                       # 13 AI Tools Hub
│   ├── chatbot.html                        # AI Wedding Chatbot
│   ├── about.html                          # About Us
│   ├── contact.html                        # Contact
│   ├── planning-form.html                  # Wedding Planning Form
│   ├── embed.html                          # Embed tools guide
│   ├── offline.html                        # PWA offline page
│   ├── privacy-policy.html                 # Privacy Policy
│   └── terms.html                          # Terms & Conditions
│
├── AI TOOLS (13)
│   ├── ai-invitation-writer.html
│   ├── ai-kundali-matching.html
│   ├── ai-budget-calculator.html
│   ├── ai-playlist-generator.html
│   ├── ai-menu-planner.html
│   ├── ai-photography-shots.html
│   ├── ai-wedding-theme-generator.html
│   ├── ai-guest-manager.html
│   ├── ai-planning-timeline.html
│   ├── whatsapp-invite-generator.html
│   ├── wedding-budget-calculator-india-2026.html
│   ├── destination-wedding-calculator-india-2026.html
│   └── wedding-vendor-negotiation-bot.html
│
├── BLOGS (60+)
│   ├── blog-budget-2026.html               # Budget guides
│   ├── blog-5-lakh-wedding.html
│   ├── blog-200-guest-wedding-budget-india-2026.html
│   ├── blog-delhi-wedding-cost-2026.html   # City guides
│   ├── blog-mumbai-wedding-cost-2026.html
│   ├── blog-bangalore-wedding-cost-2026.html
│   ├── blog-hyderabad-wedding-cost-2026.html
│   ├── blog-pune-wedding-cost-2026.html
│   ├── blog-destinations.html              # Destination guides
│   ├── blog-ai-hacks.html                  # AI guides
│   ├── blog-wedding-checklist.html         # Planning guides
│   └── blog-*.html                         # 50+ more articles
│
├── VENDORS
│   ├── vendors/index.html                  # Vendor Directory
│   └── vendors/apply.html                  # Vendor Application
│
├── PWA & CONFIG
│   ├── manifest.json                       # PWA manifest
│   ├── sw.js                               # Service Worker
│   ├── vercel.json                         # Vercel config (www→non-www redirect)
│   ├── robots.txt                          # Search engine rules
│   ├── sitemap.xml                         # SEO Sitemap (77 URLs)
│   ├── ads.txt                             # AdSense verification
│   └── verify-payment.js                   # SS_PRO plan verification
│
└── api/
    └── groq-agent.js                       # Vercel serverless function (legacy)
```

---

## 🔧 API Backend

All AI tools use the **Anthropic Claude API**:

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  })
});
```

---

## 🌐 Domain & Hosting Configuration

```
Primary URL:   https://smartshaadi.online        ← canonical (non-www)
Redirect:      https://www.smartshaadi.online → smartshaadi.online (301)
Hosting:       Vercel (auto-deploy from GitHub main branch)
DNS:           Vercel DNS (ns1.vercel-dns.com, ns2.vercel-dns.com)
Domain:        Hostinger (DNS pointed to Vercel)
SSL:           HTTPS active on both www and non-www
```

**vercel.json** handles www → non-www redirect:
```json
{
  "redirects": [{
    "source": "/(.*)",
    "has": [{"type": "host", "value": "www.smartshaadi.online"}],
    "destination": "https://smartshaadi.online/$1",
    "permanent": true
  }]
}
```

---

## 🌐 SEO Configuration

- **Canonical URLs:** All 80+ pages use `https://smartshaadi.online/` (non-www)
- **Structured Data:** Article, FAQPage, ItemList, WebApplication, Organization schemas
- **Sitemap:** `smartshaadi.online/sitemap.xml` — 77 URLs submitted to Google
- **Search Console:** Verified, sitemap submitted, 43+ pages indexed
- **Open Graph + Twitter Card** meta tags on all pages
- **FAQ Schema** on every blog page (5 FAQs each)
- **Real Couple Case Studies** on every blog (human-written content signal)
- Language: `hi-IN` / `en-IN`

---

## 🎨 Design System

```css
/* Core Color Palette */
--gold:    #C9A84C   /* Primary — buttons, highlights */
--bg:      #08060E   /* Dark background */
--text:    #F5EFE0   /* Primary text */
--muted:   #A89070   /* Secondary text */
--green:   #4ADE80   /* Success states */

/* Typography */
Headings: Cormorant Garamond (serif, elegant)
Body:     Plus Jakarta Sans / DM Sans (modern)
Special:  Orbitron (calculator/tech pages)
```

---

## 💰 Monetization

- **Google AdSense** (`ca-pub-3031340680723255`) — Approval pending, ads NOT active on pages
- **Vendor Directory** — Paid listings (₹999–₹2,999/month)
- **Goal:** AdSense approval → display ads on blog pages

---

## 📊 SEO & Traffic (March 2026)

```
Indexed Pages:     43+ (of 77 submitted)
Total Clicks:      42 (last 3 months)
Total Impressions: 110
Average CTR:       50% (India traffic)
Average Position:  3.5
Primary Traffic:   India (mobile-first)
```

---

## ⚠️ Important Development Rules

### Always Do:
- Canonical = `https://smartshaadi.online/PAGENAME.html` (non-www always)
- New blog pages must have: canonical, FAQ schema, case study, tool promo
- Wrap `SS_PRO.isProLocal()` in try-catch (verify-payment.js may not load)
- Use "SmartShaadi AI" or "SmartShaadi Team" in public content

### Never Do:
- ❌ Add AdSense `<ins class="adsbygoogle">` tags
- ❌ Use `https://www.smartshaadi.online` as canonical
- ❌ Call `SS_PRO.isProLocal()` without try-catch
- ❌ Remove www redirect from vercel.json

---

## 👤 Developer

**Mubashir Hasan**  
*Full-Stack Developer & AI Product Builder*

- GitHub: [@muahshi](https://github.com/muahshi)
- Website: [smartshaadi.online](https://smartshaadi.online)
- Email: muahshi.dev@gmail.com

---

## 📄 License

This project is **proprietary**. All rights reserved © 2026 Smart Shaadi AI.

Unauthorized copying, distribution, or commercial use is prohibited.

---

*India ka #1 Free AI Wedding Planner — Technology aur tradition ka perfect milan* 💍
