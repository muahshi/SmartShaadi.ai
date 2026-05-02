# 💍 Smart Shaadi AI — India's AI Wedding Planner

Free AI-powered wedding planning platform for Indian couples. Hindi + English support, zero login required.

**Live:** [smartshaadi.online](https://smartshaadi.online)

---

## Tech Stack

| Layer | Detail |
|---|---|
| Frontend | Pure HTML5, CSS3, Vanilla JS (ES6) — zero frameworks |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Payments | Razorpay (Pro plan — ₹199/month) |
| Hosting | Vercel (auto-deploy from GitHub `main`) |
| DNS | Vercel DNS via Hostinger domain |
| Analytics | Google Analytics 4 (`G-Y6QPBQ6QZE`) |
| Fonts | Cormorant Garamond, DM Sans (main site) · Playfair Display, Lato (sub-pages) |
| PWA | `manifest.json` + `sw.js` (offline support) |

---

## Project Structure

```
smartshaadi.online/
│
├── CORE PAGES
│   ├── index.html                    # Homepage
│   ├── app.html                      # Wedding Planning Dashboard (PWA)
│   ├── webapp.html                   # Mobile-first App Shell
│   ├── dashboard.html                # Full Planning Dashboard
│   ├── chatbot.html                  # AI Wedding Chatbot
│   ├── blogs.html                    # Magazine (60+ articles)
│   ├── ai-tools.html                 # All AI Tools hub page
│   ├── planning-form.html            # Wedding onboarding form
│   ├── about.html
│   ├── contact.html
│   ├── embed.html                    # Embed tools guide
│   ├── offline.html                  # PWA offline fallback (do not delete)
│   ├── privacy-policy.html
│   └── terms.html
│
├── AI TOOLS (16)
│   ├── ai-invitation-writer.html     # 8 styles, 6 languages
│   ├── ai-kundali-matching.html      # 36 Guna Milan, Mangal/Nadi Dosha
│   ├── ai-budget-calculator.html     # City-wise budget breakdown
│   ├── ai-budget-optimizer.html      # Savings suggestions on existing budget
│   ├── ai-playlist-generator.html    # Ceremony-wise Bollywood suggestions
│   ├── ai-menu-planner.html          # 10 regional cuisines + caterer brief
│   ├── ai-photography-shots.html     # 100+ shot list with pose directions
│   ├── ai-wedding-theme-generator.html # HEX palette + mood board
│   ├── ai-guest-manager.html         # Guest list + RSVP tracking
│   ├── ai-planning-timeline.html     # 9-milestone countdown
│   ├── ai-vendor-price-predictor.html # Vendor cost forecasting
│   ├── ai-hidden-cost-detector.html  # Flags hidden wedding expenses
│   ├── whatsapp-invite-generator.html # Bulk WhatsApp invite sender
│   ├── wedding-budget-calculator-india-2026.html # 15 cities, donut chart
│   ├── destination-wedding-calculator-india-2026.html # 8 destinations
│   └── wedding-vendor-negotiation-bot.html # Hinglish negotiation scripts
│
├── BLOGS (60+)
│   ├── Budget guides          blog-budget-2026, blog-5-lakh-wedding, blog-200-guest-*
│   ├── City cost guides       blog-delhi-*, blog-mumbai-*, blog-bangalore-*, ...
│   ├── Ceremony guides        blog-haldi-*, blog-sangeet-*, blog-engagement-*
│   ├── Vendor cost guides     blog-catering-cost-*, blog-wedding-photography-cost-*, ...
│   ├── Shopping guides        blog-chandni-chowk-*, blog-delhi-markets, ...
│   ├── AI guides              blog-ai-hacks, blog-ai-wedding-planner, ...
│   └── Case studies           jaipur-ai-wedding-case-study, nri-wedding-blog
│
├── VENDORS
│   ├── vendors/index.html            # Vendor directory
│   └── vendors/apply.html            # Vendor listing application
│
├── AGENTS (internal)
│   ├── agents/agent-seo-blog-writer.html
│   ├── agents/agent-marketing-content.html
│   └── agents/agent-vendor-lead.html
│
├── API (Vercel serverless)
│   ├── api/chat.js                   # Chatbot endpoint
│   ├── api/groq-agent.js             # Legacy Groq agent
│   ├── api/razorpay-config.js        # Payment config
│   ├── api/send-otp.js
│   ├── api/verify-otp.js
│   └── api/check-pro.js             # Pro plan verification
│
└── CONFIG & PWA
    ├── vercel.json                   # Routing + www redirect + clean URL redirects
    ├── sitemap.xml                   # 90 URLs
    ├── robots.txt
    ├── manifest.json
    ├── sw.js
    ├── ads.txt                       # AdSense verification (approval pending)
    ├── verify-payment.js             # SS_PRO plan check (client-side)
    └── pro-guard.js                  # Pro feature gate
```

---

## AI API Call Pattern

All AI tools use this pattern directly from the browser:

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

## Monetization

| Stream | Detail | Status |
|---|---|---|
| Google AdSense | `ca-pub-3031340680723255` | Pending approval |
| Pro Plan | ₹199/month via Razorpay — unlocks all 16 AI tools | Live |
| Vendor Listings | Basic ₹999 · Featured ₹1,999 · Premium ₹2,999/month | Live |

---

## Design System

```css
/* Dark mode (default) */
--bg:    #0D0B0E    /* Page background */
--gold:  #C9A84C   /* Primary — buttons, highlights */
--text:  #F5EFE0   /* Body text */
--muted: #9A9088   /* Secondary text */
--green: #7ED3A0   /* Success */
--red:   #e07070   /* Error */

/* Light mode — auto via prefers-color-scheme + manual [data-theme] toggle */
--bg:    #FAF8F4
--gold:  #7A5210
--text:  #1A1410
```

Both dark and light mode are fully supported via CSS variables and `[data-theme]` attribute toggle.

---

## Routing (vercel.json)

`vercel.json` handles two things:

1. **www → non-www redirect** (permanent 301)
2. **Clean URL redirects** — every page has an extensionless route, e.g. `/ai-menu-planner` → `/ai-menu-planner.html`

Canonical URL format: `https://smartshaadi.online/page-name.html` (always non-www, always with .html)

---

## SEO Setup

- Canonical tags on all 90+ pages (non-www, `.html`)
- Sitemap: `sitemap.xml` — 90 URLs submitted to Google Search Console
- Structured data: Article, FAQPage, WebApplication, Organization schemas
- Open Graph + Twitter Card on all pages
- FAQ schema on every blog (5 FAQs each)
- Language: `hi-IN` / `en-IN`
- Search Console: Verified, sitemap submitted

---

## Development Rules

**Always:**
- Canonical = `https://smartshaadi.online/PAGENAME.html` (non-www, with .html)
- New blog pages must have: canonical, FAQ schema (5 questions), case study section, AI tool promo CTA
- Wrap `SS_PRO.isProLocal()` in try-catch — `verify-payment.js` may not load
- Add new pages to `sitemap.xml` and `vercel.json` (clean URL redirect)
- Use `SmartShaadi AI` or `SmartShaadi Team` in all public-facing content

**Never:**
- Add AdSense `<ins class="adsbygoogle">` tags anywhere (approval still pending)
- Use `https://www.smartshaadi.online` as canonical
- Call `SS_PRO.isProLocal()` without try-catch
- Delete `offline.html` (PWA service worker depends on it)
- Remove www redirect from `vercel.json`
- Create near-duplicate blog pages on the same topic (keyword cannibalization)

---

## Hosting & Domain

```
Primary URL:  https://smartshaadi.online        ← canonical (non-www)
Redirect:     https://www.smartshaadi.online → smartshaadi.online (301)
Hosting:      Vercel (auto-deploy from GitHub main branch)
DNS:          Vercel DNS (ns1.vercel-dns.com, ns2.vercel-dns.com)
Domain:       Hostinger (DNS pointed to Vercel)
SSL:          Active on both www and non-www
```

---

## Developer

**Mubashir Hasan** — Full-Stack Developer & AI Product Builder
- GitHub: [@muahshi](https://github.com/muahshi)
- Email: muahshi.dev@gmail.com

---

*© 2026 Smart Shaadi AI. Proprietary. All rights reserved.*
