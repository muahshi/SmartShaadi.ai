# 💍 Smart Shaadi AI — India's #1 Free AI Wedding Planner

**Smart Shaadi AI** is a free, AI-powered wedding planning platform built for Indian couples. It combines powerful planning tools with a beautiful UI — helping couples plan their dream shaadi stress-free, in Hindi or English, at zero cost.

![Version](https://img.shields.io/badge/Version-3.0-gold)
![Tech](https://img.shields.io/badge/Tech-Vanilla_JS-orange)
![AI](https://img.shields.io/badge/AI-Groq_Llama_3.3-blue)
![License](https://img.shields.io/badge/License-Proprietary-red)

## 🚀 Live Site
**[smartshaadi.online](https://www.smartshaadi.online)**

---

## ✨ Features

### 🤖 9 Free AI Tools
| Tool | Description |
|------|-------------|
| 💌 AI Invitation Writer | 8 styles, 6 languages (Hindi, English, Hinglish, Urdu, Marathi, Punjabi) |
| 🔮 AI Kundali Matching | 36 Guna Milan, Mangal Dosha, Nadi Dosha analysis |
| 💰 AI Budget Calculator | City-wise budget breakdown with savings tips |
| 🎵 AI Playlist Generator | Ceremony + reception song suggestions |
| 🍽️ AI Menu Planner | Veg/Non-Veg menu planning by guest count |
| 📸 AI Photography Shots | Shotlist generator for photographers |
| 🎨 AI Theme Generator | Wedding theme & color palette suggestions |
| 👥 AI Guest Manager | Smart guest list with RSVP tracking |
| 📅 AI Planning Timeline | 9-milestone countdown from today to wedding day |

### 🛠️ Free Planning Dashboard
- **Budget Splitter** — Auto-splits budget into Venue, Catering, Decor, Photography, Music, Misc
- **Guest Manager** — Track guests, meal preferences, RSVP status, per-plate cost
- **RSVP Tracker** — Live confirmed/pending/declined count with catering estimate
- **Venue Comparison** — Compare multiple venues by cost, capacity, rating; auto-highlights best value
- **Timeline Generator** — Enter wedding date → get 9 auto-generated milestones
- **Overview Dashboard** — Live stats: budget, guests, confirmed RSVPs, best venue, tasks left

### 💬 AI Chatbot
- Hindi + English (Hinglish) support
- Powered by **Groq API** (llama-3.3-70b-versatile)
- Complete wedding plan + PDF report generation
- No login required, 100% free

### 📖 Magazine
- 43+ expert articles on budget, venues, city guides, shopping, decor, AI hacks
- City-specific guides: Mumbai, Delhi, Bangalore, Hyderabad, Pune
- Search + category filter

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Pure HTML5, CSS3, Vanilla JavaScript (ES6) |
| AI Backend | Groq API — llama-3.3-70b-versatile |
| Hosting | Vercel (Serverless Functions) |
| Analytics | Google Analytics 4 |
| Ads | Google AdSense |
| Fonts | Google Fonts (Cormorant Garamond, DM Sans) |
| PDF | jsPDF |
| Storage | localStorage (client-side, no database) |

**Zero external UI dependencies** — no jQuery, no Bootstrap, no React. Pure vanilla stack for maximum performance.

---

## 📁 Project Structure

```
smartshaadi.online/
├── index.html                          # Homepage + Planning Dashboard
├── blogs.html                          # Magazine (43+ articles)
├── about.html                          # About Us
├── contact.html                        # Contact
├── privacy-policy.html                 # Privacy Policy (AdSense compliant)
├── terms.html                          # Terms & Conditions
├── chatbot.html                        # AI Wedding Planner Chatbot
├── planning-form.html                  # Wedding Planning Form
├── dashboard.html                      # Full Planning Dashboard
├── ai-tools.html                       # 9 AI Tools Hub
├── ai-invitation-writer.html
├── ai-kundali-matching.html
├── ai-budget-calculator.html
├── ai-playlist-generator.html
├── ai-menu-planner.html
├── ai-photography-shots.html
├── ai-wedding-theme-generator.html
├── ai-guest-manager.html
├── ai-planning-timeline.html
├── wedding-budget-calculator-india-2026.html
├── destination-wedding-calculator-india-2026.html
├── whatsapp-invite-generator.html
├── wedding-vendor-negotiation-bot.html
├── blog-*.html                         # 43+ magazine articles
├── sitemap.xml
└── api/
    └── groq-agent.js                   # Vercel serverless — Groq API handler
```

---

## 🔧 API Backend

All 9 AI tools + chatbot use a single Vercel serverless function:

**`/api/groq-agent.js`**

```
POST /api/groq-agent
Content-Type: application/json

{
  "system": "System prompt string",
  "messages": [
    { "role": "user", "content": "User message" }
  ]
}
```

Response: Raw Groq API JSON (`choices[0].message.content`)

**Environment Variable required:**
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

Set in Vercel Dashboard → Settings → Environment Variables.

---

## 🌐 SEO

- Structured Data (Schema.org): WebSite, SoftwareApplication, Organization, FAQPage
- Canonical URLs on all pages
- Open Graph + Twitter Card meta tags
- Google Analytics 4 integrated
- Sitemap: `smartshaadi.online/sitemap.xml`
- Language: `hi-IN` / `en-IN`

---

## 💰 Monetization

- **Google AdSense** (`ca-pub-3031340680723255`) — Ad slots on homepage, blogs, and tool pages
- AdSense compliant: Privacy Policy, Terms, About Us, Contact pages all present

---

## 👤 Developer

**Mubashir Hasan**
*Full-Stack Developer & AI Product Builder*

- GitHub: [@muahshi](https://github.com/muahshi)
- Website: [smartshaadi.online](https://www.smartshaadi.online)
- Email: muahshi.dev@gmail.com

---

## 📄 License

This project is **proprietary**. All rights reserved © 2026 Smart Shaadi AI.

Unauthorized copying, distribution, or commercial use is prohibited.
