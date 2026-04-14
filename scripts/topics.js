/**
 * SmartShaadi Topic Manager
 * File: scripts/topics.js
 *
 * Yahan 2 cheezein hain:
 *
 * 1. MANUAL TOPICS QUEUE — tumne manually likhein hue topics
 *    Jab bhi naye topics add karne hain, sirf is file mein add karo
 *    generate-blog.js ko touch karna hi nahi padega
 *
 * 2. AI TOPIC GENERATOR — agar manual queue khatam ho jaaye toh
 *    Groq API se automatically naye topic ideas generate hote hain
 *    Aur is file mein save ho jaate hain (auto-replenish)
 */

// ─── TOPIC TEMPLATE ───────────────────────────────────────────────────────────
// Naya topic add karne ke liye is structure ko copy-paste karo:
/*
{
  slug: 'blog-[topic-name]-2026',
  title: '[Full Title] — [Subtitle]',
  category: 'City Guide' | 'Vendor Guide' | 'Planning Guide' | 'Ceremony Guide' | 'Shopping Guide' | 'Destination Guide' | 'AI Guide',
  catTag: 'city budget' | 'vendor budget' | 'planning budget' | etc,
  emoji: '🏙️',
  gradient: 'linear-gradient(135deg,#0a0800 0%,#1a1200 100%)',
  readTime: '12 min read',
  searchTerms: 'keyword1 keyword2 keyword3 city',
  keyFocus: 'Kya cover karna hai is blog mein — specific details',
  caseStudyCity: 'City Name',
  relatedTool: {
    href: '/tool-name.html',
    name: '🔧 Tool Name',
    desc: 'Tool ki one-line description'
  }
},
*/

const MANUAL_TOPICS = [

  // ── CITY GUIDES ─────────────────────────────────────────────────────────────
  {
    slug: 'blog-lucknow-wedding-cost-2026',
    title: 'Lucknow Wedding Cost 2026 — Nawabi Shaadi Ka Complete Budget',
    category: 'City Guide',
    catTag: 'city budget',
    emoji: '🕌',
    gradient: 'linear-gradient(135deg,#100a00 0%,#1e1200 100%)',
    readTime: '12 min read',
    searchTerms: 'Lucknow wedding cost 2026 Nawabi shaadi budget UP wedding Hazratganj venue',
    keyFocus: 'Lucknow mein Nawabi culture ki wedding — Nikaah vs Hindu traditions both. Hazratganj vs Gomti Nagar venues. Awadhi catering (biryani, kebabs) cost. Chikankari outfit shopping guide.',
    caseStudyCity: 'Lucknow',
    relatedTool: { href: '/wedding-budget-calculator-india-2026.html', name: '🧮 Budget Calculator', desc: 'Lucknow wedding ka exact budget 2 minute mein — free!' }
  },
  {
    slug: 'blog-goa-wedding-cost-2026',
    title: 'Goa Wedding Cost 2026 — Beach Wedding Ka Complete Budget Guide',
    category: 'Destination Guide',
    catTag: 'destination budget',
    emoji: '🏖️',
    gradient: 'linear-gradient(135deg,#001a1a 0%,#002828 100%)',
    readTime: '13 min read',
    searchTerms: 'Goa beach wedding cost 2026 destination wedding budget resort North South Goa',
    keyFocus: 'Goa beach wedding budget — North Goa vs South Goa venues, resort vs private beach costs. Permit requirements, catering (seafood), sunset timing. Monsoon vs winter season pricing.',
    caseStudyCity: 'Panaji',
    relatedTool: { href: '/destination-wedding-calculator-india-2026.html', name: '✈️ Destination Calculator', desc: 'Goa wedding ka exact destination budget — free calculator!' }
  },
  {
    slug: 'blog-udaipur-wedding-cost-2026',
    title: 'Udaipur Wedding Cost 2026 — City of Lakes Mein Dream Wedding',
    category: 'Destination Guide',
    catTag: 'destination budget',
    emoji: '🏰',
    gradient: 'linear-gradient(135deg,#12080a 0%,#1e1018 100%)',
    readTime: '13 min read',
    searchTerms: 'Udaipur wedding cost 2026 destination wedding palace venue lake pichola',
    keyFocus: 'Udaipur mein palace aur lake-view weddings — Taj Lake Palace vs budget alternatives. Jag Mandir vs Fateh Sagar venues. November-February peak season premium. NRI couples ke liye popular choice.',
    caseStudyCity: 'Udaipur',
    relatedTool: { href: '/destination-wedding-calculator-india-2026.html', name: '✈️ Destination Calculator', desc: 'Udaipur destination wedding budget instantly calculate karo — free!' }
  },
  {
    slug: 'blog-varanasi-wedding-cost-2026',
    title: 'Varanasi Wedding Cost 2026 — Kashi Mein Traditional Shaadi Ka Budget',
    category: 'City Guide',
    catTag: 'city budget',
    emoji: '🕯️',
    gradient: 'linear-gradient(135deg,#120a00 0%,#201500 100%)',
    readTime: '11 min read',
    searchTerms: 'Varanasi wedding cost 2026 Kashi shaadi budget Ghat wedding Banaras',
    keyFocus: 'Varanasi mein traditional Hindu wedding — Ghat ceremonies, Pandit costs, Silk saree (Banarasi). Cantonment area vs old city venues. River Ganga wedding photography. Pilgrim season impact.',
    caseStudyCity: 'Varanasi',
    relatedTool: { href: '/ai-planning-timeline.html', name: '📅 Planning Timeline', desc: 'Varanasi wedding ki month-wise planning AI se banao — free!' }
  },
  {
    slug: 'blog-kerala-wedding-cost-2026',
    title: 'Kerala Wedding Cost 2026 — South Indian Sadya aur Tradition Ka Budget',
    category: 'City Guide',
    catTag: 'city budget',
    emoji: '🌴',
    gradient: 'linear-gradient(135deg,#001a08 0%,#002510 100%)',
    readTime: '12 min read',
    searchTerms: 'Kerala wedding cost 2026 South Indian wedding budget Kochi Thiruvananthapuram Sadya',
    keyFocus: 'Kerala wedding traditions — Kooththu, Nischayam, Sadya feast. Kochi vs Thiruvananthapuram vs Kozhikode venues. Kerala silk set saree cost. Backwater venue ka extra charm aur extra cost.',
    caseStudyCity: 'Kochi',
    relatedTool: { href: '/ai-menu-planner.html', name: '🍽️ AI Menu Planner', desc: 'Kerala Sadya menu AI se plan karo — free!' }
  },
  {
    slug: 'blog-surat-wedding-cost-2026',
    title: 'Surat Wedding Cost 2026 — Diamond City Mein Gujarati Shaadi',
    category: 'City Guide',
    catTag: 'city budget',
    emoji: '💎',
    gradient: 'linear-gradient(135deg,#0a100a 0%,#101a08 100%)',
    readTime: '11 min read',
    searchTerms: 'Surat wedding cost 2026 Gujarati shaadi budget Diamond City venue catering',
    keyFocus: 'Surat mein Gujarati business community ki weddings — lavish but value-conscious. Athwa Lines vs Adajan venues. Textile market se outfit shopping (40% cheaper than Mumbai). Farsan aur Gujarati thali catering.',
    caseStudyCity: 'Surat',
    relatedTool: { href: '/ai-budget-optimizer.html', name: '⚡ Budget Optimizer', desc: 'Surat wedding budget live optimize karo — free!' }
  },

  // ── VENDOR GUIDES ────────────────────────────────────────────────────────────
  {
    slug: 'blog-wedding-florist-cost-2026',
    title: 'Wedding Florist Cost 2026 — Flowers Ka Complete Budget Guide',
    category: 'Vendor Guide',
    catTag: 'vendor budget',
    emoji: '💐',
    gradient: 'linear-gradient(135deg,#0a1205 0%,#121e08 100%)',
    readTime: '10 min read',
    searchTerms: 'wedding florist cost 2026 India flower decoration rose marigold budget',
    keyFocus: 'Wedding flowers ka realistic budget — Rose vs Marigold vs Exotic flowers cost. Phool mandi se direct vs florist ke through difference. Seasonal flowers ki price volatility. Sustainable flower alternatives.',
    caseStudyCity: 'Bhopal',
    relatedTool: { href: '/ai-wedding-theme-generator.html', name: '🎨 AI Theme Generator', desc: 'Flower theme AI se choose karo — free!' }
  },
  {
    slug: 'blog-wedding-pandit-dakshina-2026',
    title: 'Wedding Pandit aur Dakshina Cost 2026 — Complete Ritual Guide',
    category: 'Vendor Guide',
    catTag: 'vendor budget',
    emoji: '🕉️',
    gradient: 'linear-gradient(135deg,#120a00 0%,#1e1400 100%)',
    readTime: '10 min read',
    searchTerms: 'wedding pandit cost dakshina 2026 India ritual puja samagri vidhi',
    keyFocus: 'Pandit cost aur dakshina guide — different rituals ke liye alag rates. Samagri list aur cost. Muhurat ki importance aur pandit fees. Regional differences (UP pandit vs South acharya). Online pandit booking.',
    caseStudyCity: 'Indore',
    relatedTool: { href: '/ai-planning-timeline.html', name: '📅 AI Planning Timeline', desc: 'Muhurat aur ritual timeline AI se plan karo — free!' }
  },
  {
    slug: 'blog-wedding-horse-doli-cost-2026',
    title: 'Wedding Ghodi aur Doli Cost 2026 — Baraat Ka Traditional Look',
    category: 'Vendor Guide',
    catTag: 'vendor budget',
    emoji: '🐎',
    gradient: 'linear-gradient(135deg,#0a0812 0%,#10101e 100%)',
    readTime: '9 min read',
    searchTerms: 'wedding ghodi cost 2026 doli baraat horse decorated India rates',
    keyFocus: 'Ghodi (wedding horse) aur Doli ka rental cost — decorated ghodi ₹3K-15K, vintage car alternative. Doli rental ₹5K-20K. City-wise rates, route restrictions, photography tips.',
    caseStudyCity: 'Delhi',
    relatedTool: { href: '/wedding-vendor-negotiation-bot.html', name: '🤝 Negotiation Bot', desc: 'Ghodi wale se negotiate karo — ready scripts free!' }
  },
  {
    slug: 'blog-wedding-light-sound-cost-2026',
    title: 'Wedding Lighting aur Sound System Cost 2026 — Complete Guide',
    category: 'Vendor Guide',
    catTag: 'vendor budget',
    emoji: '💡',
    gradient: 'linear-gradient(135deg,#0a0a00 0%,#181800 100%)',
    readTime: '10 min read',
    searchTerms: 'wedding lighting sound system cost 2026 India LED decoration stage light',
    keyFocus: 'Wedding lighting packages — LED wall, fairy lights, stage lighting, entry gates. Sound system for different venue sizes. Generator backup cost. Drone light show (new trend). City-wise rates.',
    caseStudyCity: 'Pune',
    relatedTool: { href: '/ai-hidden-cost-detector.html', name: '🔍 Hidden Cost Detector', desc: 'Lighting aur sound ke hidden charges detect karo — free!' }
  },

  // ── PLANNING GUIDES ──────────────────────────────────────────────────────────
  {
    slug: 'blog-digital-wedding-invitations-2026',
    title: 'Digital Wedding Invitations 2026 — WhatsApp se Video Card Tak Guide',
    category: 'Planning Guide',
    catTag: 'planning',
    emoji: '📱',
    gradient: 'linear-gradient(135deg,#080a18 0%,#101228 100%)',
    readTime: '10 min read',
    searchTerms: 'digital wedding invitations 2026 WhatsApp video card India free paid options',
    keyFocus: 'Digital invitation complete guide — free vs paid options, video invites ₹2K-15K, AI-generated cards (SmartShaadi free tool). WhatsApp bulk sender, RSVP tracking. Elders ke liye printed vs digital hybrid strategy.',
    caseStudyCity: 'Bengaluru',
    relatedTool: { href: '/ai-invitation-writer.html', name: '💌 AI Invitation Writer', desc: '30 second mein beautiful digital invite — 6 languages, free!' }
  },
  {
    slug: 'blog-wedding-insurance-india-2026',
    title: 'Wedding Insurance India 2026 — Kyun Zaroori Hai aur Kya Cover Hota Hai',
    category: 'Planning Guide',
    catTag: 'planning',
    emoji: '🛡️',
    gradient: 'linear-gradient(135deg,#080a10 0%,#10121a 100%)',
    readTime: '11 min read',
    searchTerms: 'wedding insurance India 2026 policy coverage cancellation vendor default',
    keyFocus: 'Wedding insurance — kya cover hota hai (vendor cancellation, weather, medical emergency). Top Indian policies comparison. Premium cost ₹5K-25K. Real claim stories. Kab lena chahiye insurance.',
    caseStudyCity: 'Mumbai',
    relatedTool: { href: '/ai-hidden-cost-detector.html', name: '🔍 Hidden Cost Detector', desc: 'Wedding ke unexpected risks aur costs detect karo — free!' }
  },
  {
    slug: 'blog-rishikesh-wedding-cost-2026',
    title: 'Rishikesh Wedding Cost 2026 — Spiritual aur Adventure Wedding Guide',
    category: 'Destination Guide',
    catTag: 'destination budget',
    emoji: '🏔️',
    gradient: 'linear-gradient(135deg,#051208 0%,#0a1e10 100%)',
    readTime: '11 min read',
    searchTerms: 'Rishikesh wedding cost 2026 destination wedding Ganga riverside spiritual adventure',
    keyFocus: 'Rishikesh mein riverside wedding — Ganga ghats, yoga ashram weddings, adventure theme. Permit requirements for outdoor ceremonies. Vegetarian-only zone restrictions. Budget vs luxury resorts.',
    caseStudyCity: 'Rishikesh',
    relatedTool: { href: '/destination-wedding-calculator-india-2026.html', name: '✈️ Destination Calculator', desc: 'Rishikesh wedding budget calculate karo — free!' }
  },
  {
    slug: 'blog-chatgpt-vs-smartshaadi-2026',
    title: 'ChatGPT vs SmartShaadi — Wedding Planning Mein Kaun Better Hai?',
    category: 'AI Guide',
    catTag: 'ai',
    emoji: '🤖',
    gradient: 'linear-gradient(135deg,#080a18 0%,#0e1228 100%)',
    readTime: '10 min read',
    searchTerms: 'ChatGPT vs SmartShaadi AI wedding planning comparison 2026 India which is better',
    keyFocus: 'Honest comparison — ChatGPT general AI vs SmartShaadi specialized tools. India-specific data advantage. Vendor negotiation scripts, budget calculator, kundali matching — jo ChatGPT nahi kar sakta. Free vs paid.',
    caseStudyCity: 'Hyderabad',
    relatedTool: { href: '/ai-tools.html', name: '🛠️ 13 Free AI Tools', desc: 'SmartShaadi ke saare specialized wedding AI tools — free!' }
  },
  {
    slug: 'blog-nagpur-wedding-cost-2026',
    title: 'Nagpur Wedding Cost 2026 — Orange City Mein Shaadi Ka Complete Budget',
    category: 'City Guide',
    catTag: 'city budget',
    emoji: '🍊',
    gradient: 'linear-gradient(135deg,#180800 0%,#221000 100%)',
    readTime: '11 min read',
    searchTerms: 'Nagpur wedding cost 2026 Maharashtra shaadi budget Vidarbha wedding venue',
    keyFocus: 'Nagpur mein Vidarbha culture wedding — Marathi + Hindi mix traditions. Civil Lines vs Dharampeth venues. Budget-friendly tier-2 city advantage. Orange farming season impact on flowers.',
    caseStudyCity: 'Nagpur',
    relatedTool: { href: '/ai-vendor-price-predictor.html', name: '📊 Vendor Price Predictor', desc: 'Nagpur mein vendor ka sahi rate jaano — AI se free!' }
  },
  {
    slug: 'blog-wedding-mehendi-design-cost-2026',
    title: 'Wedding Mehendi Design aur Cost 2026 — Bridal se Guests Tak Complete Guide',
    category: 'Vendor Guide',
    catTag: 'vendor budget',
    emoji: '🌿',
    gradient: 'linear-gradient(135deg,#0a1a00 0%,#142500 100%)',
    readTime: '10 min read',
    searchTerms: 'wedding mehendi design cost 2026 bridal mehndi artist rates India',
    keyFocus: 'Mehendi artist hire guide — bridal full hands+feet ₹2K-15K. Guest mehendi per head cost. Arabic vs Rajasthani vs Bridal designs price difference. Quality check kaise karein. Best mehendi artists kaise dhundein.',
    caseStudyCity: 'Jaipur',
    relatedTool: { href: '/wedding-vendor-negotiation-bot.html', name: '🤝 Negotiation Bot', desc: 'Mehendi artist se best rate negotiate karo — scripts free!' }
  },
  {
    slug: 'blog-wedding-trousseau-packing-2026',
    title: 'Wedding Trousseau Packing Cost 2026 — Doli Sajao Guide',
    category: 'Planning Guide',
    catTag: 'planning budget',
    emoji: '🎀',
    gradient: 'linear-gradient(135deg,#150510 0%,#200818 100%)',
    readTime: '10 min read',
    searchTerms: 'wedding trousseau packing cost 2026 India doli decoration shaadi gifts',
    keyFocus: 'Trousseau packing — professional decorator ₹15K-80K vs DIY. Doli decoration. Gift items list aur budget. Packaging materials, boxes, ribbons. Instagram-worthy trousseau on a budget.',
    caseStudyCity: 'Bhopal',
    relatedTool: { href: '/ai-guest-manager.html', name: '👥 AI Guest Manager', desc: 'Gift tracking aur guest management AI se — free!' }
  },
  {
    slug: 'blog-winter-wedding-india-2026',
    title: 'Winter Wedding India 2026 — Best Season, Best Budget, Best Tips',
    category: 'Planning Guide',
    catTag: 'planning budget',
    emoji: '❄️',
    gradient: 'linear-gradient(135deg,#080c18 0%,#0e1225 100%)',
    readTime: '11 min read',
    searchTerms: 'winter wedding India 2026 November December January best season budget tips',
    keyFocus: 'Winter wedding (Oct-Feb) complete guide — why best season but most expensive. Fog photography challenge. Heating costs for outdoor. Best winter wedding cities. Early booking discount strategy.',
    caseStudyCity: 'Delhi',
    relatedTool: { href: '/ai-planning-timeline.html', name: '📅 AI Timeline', desc: 'Winter wedding ki complete timeline AI se banao — free!' }
  },
  {
    slug: 'blog-summer-wedding-savings-2026',
    title: 'Summer Wedding Savings 2026 — Off-Season Mein ₹3 Lakh Kaise Bachayein',
    category: 'Planning Guide',
    catTag: 'planning budget',
    emoji: '☀️',
    gradient: 'linear-gradient(135deg,#1a1000 0%,#281800 100%)',
    readTime: '11 min read',
    searchTerms: 'summer wedding India 2026 off season savings April May June budget tips',
    keyFocus: 'Summer wedding (April-June) ke fayde — 20-30% cheaper vendors. Timing tricks (evening weddings), AC costs management. Hill station summer weddings (Shimla, Manali) as alternative. Real savings calculator.',
    caseStudyCity: 'Indore',
    relatedTool: { href: '/ai-budget-optimizer.html', name: '⚡ Budget Optimizer', desc: 'Off-season savings live calculate karo — AI se free!' }
  },
  {
    slug: 'blog-wedding-guest-management-2026',
    title: 'Wedding Guest Management 2026 — 200 Guests Ko Kaise Handle Karein',
    category: 'Planning Guide',
    catTag: 'planning',
    emoji: '👨‍👩‍👧‍👦',
    gradient: 'linear-gradient(135deg,#050a18 0%,#0a1228 100%)',
    readTime: '11 min read',
    searchTerms: 'wedding guest management 2026 India RSVP tracking 200 guests seating plan',
    keyFocus: 'Guest management complete system — invite list building, RSVP tracking, seating plan, dietary preferences. Technology tools vs manual. Plus-1 policy. Last-minute changes handling. SmartShaadi AI Guest Manager walkthrough.',
    caseStudyCity: 'Chandigarh',
    relatedTool: { href: '/ai-guest-manager.html', name: '👥 AI Guest Manager', desc: 'Sab guests ko AI se manage karo — RSVP tracking free!' }
  },
];

// ─── AI TOPIC GENERATOR ───────────────────────────────────────────────────────
/**
 * Jab MANUAL_TOPICS mein saare slugs exist ho jaayein,
 * Groq API se automatically 8 naye topics generate hote hain
 * Aur is file ke MANUAL_TOPICS array mein append ho jaate hain
 */
async function generateNewTopics(existingSlugs, apiKey) {
  const https = require('https');
  const fs    = require('fs');
  const path  = require('path');

  console.log('🤖 All manual topics used! Auto-generating new topics via Groq API...');

  const prompt = `You are a SEO expert for SmartShaadi.online — an Indian wedding planning website.

Existing blog slugs (do NOT suggest these):
${existingSlugs.slice(0, 30).map(s => '- ' + s).join('\n')}

Generate exactly 8 NEW high-traffic Indian wedding blog topic ideas that are NOT in the list above.

Rules:
- Focus on Indian weddings 2026
- Topics must be searchable (people actually Google these)
- Mix: city guides, vendor costs, planning tips, ceremony guides
- Each must be unique from existing content

Return ONLY valid JSON array, no explanation:
[
  {
    "slug": "blog-[topic]-2026",
    "title": "Full Title — Subtitle",
    "category": "City Guide | Vendor Guide | Planning Guide | Ceremony Guide | Destination Guide",
    "catTag": "city budget | vendor budget | planning budget | planning",
    "emoji": "single emoji",
    "gradient": "linear-gradient(135deg,#XXXXXX 0%,#YYYYYY 100%)",
    "readTime": "X min read",
    "searchTerms": "keyword1 keyword2 keyword3",
    "keyFocus": "What to cover in this blog — specific details",
    "caseStudyCity": "Indian City Name",
    "relatedToolHref": "/tool-name.html",
    "relatedToolName": "Emoji Tool Name",
    "relatedToolDesc": "One line description"
  }
]`;

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      temperature: 0.8,
      messages: [{ role: 'user', content: prompt }]
    });

    const req = https.request({
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed.choices?.[0]?.message?.content || '';
          // Extract JSON from response
          const jsonMatch = text.match(/\[[\s\S]*\]/);
          if (!jsonMatch) throw new Error('No JSON array found in response');
          const newTopics = JSON.parse(jsonMatch[0]);

          // Format to our structure
          const formatted = newTopics.map(t => ({
            slug: t.slug,
            title: t.title,
            category: t.category,
            catTag: t.catTag,
            emoji: t.emoji,
            gradient: t.gradient || 'linear-gradient(135deg,#0a0800 0%,#151000 100%)',
            readTime: t.readTime || '11 min read',
            searchTerms: t.searchTerms,
            keyFocus: t.keyFocus,
            caseStudyCity: t.caseStudyCity || 'Bhopal',
            relatedTool: {
              href: t.relatedToolHref || '/wedding-budget-calculator-india-2026.html',
              name: t.relatedToolName || '🧮 Budget Calculator',
              desc: t.relatedToolDesc || 'Free wedding budget calculator!'
            }
          }));

          // Append to this file's MANUAL_TOPICS
          const thisFile = path.join(__dirname, 'topics.js');
          let fileContent = fs.readFileSync(thisFile, 'utf-8');
          const insertPoint = fileContent.lastIndexOf('];') ;

          const newEntries = formatted.map(t =>
            `  // AUTO-GENERATED: ${new Date().toISOString().split('T')[0]}\n` +
            `  ${JSON.stringify(t, null, 2).replace(/\n/g, '\n  ')},`
          ).join('\n');

          fileContent = fileContent.slice(0, insertPoint) + '\n' + newEntries + '\n' + fileContent.slice(insertPoint);
          fs.writeFileSync(thisFile, fileContent, 'utf-8');

          console.log(`✅ Auto-generated ${formatted.length} new topics and saved to topics.js`);
          console.log('   Next run will use these new topics automatically');
          resolve(formatted);

        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Topic generation timeout')); });
    req.write(body);
    req.end();
  });
}

// ─── SMART TOPIC SELECTOR ─────────────────────────────────────────────────────
/**
 * Main function — generate-blog.js yahi call karta hai
 * Returns: next ungenerated topic
 * Agar sab generate ho jaayein: Groq se new topics fetch karta hai
 */
async function getNextTopic(apiKey) {
  const fs   = require('fs');
  const path = require('path');

  // Manual override
  const override = process.env.TOPIC_OVERRIDE || '';
  if (override) {
    const found = MANUAL_TOPICS.find(t => t.slug === override);
    if (found) {
      console.log(`🎯 Manual override: ${found.slug}`);
      return found;
    }
    console.warn(`⚠️  Override "${override}" not found in topics list`);
  }

  const force = process.env.FORCE_REGENERATE === 'true';

  // Find first ungenerated topic
  for (const topic of MANUAL_TOPICS) {
    const filePath = path.join(process.cwd(), topic.slug + '.html');
    if (!fs.existsSync(filePath) || force) {
      console.log(`✅ Next topic: ${topic.slug}`);
      return topic;
    }
  }

  // All topics generated! Auto-fetch new ones
  console.log('📋 All manual topics generated!');
  if (apiKey) {
    try {
      const existingSlugs = MANUAL_TOPICS.map(t => t.slug);
      const newTopics = await generateNewTopics(existingSlugs, apiKey);
      if (newTopics.length > 0) {
        console.log(`🎉 Got ${newTopics.length} new topics! Using first one.`);
        return newTopics[0];
      }
    } catch(e) {
      console.warn(`⚠️  Auto-generation failed: ${e.message}`);
    }
  }

  // Absolute fallback — oldest topic regenerate
  console.log('🔄 Fallback: regenerating first topic');
  return MANUAL_TOPICS[0];
}

module.exports = { MANUAL_TOPICS, getNextTopic };
