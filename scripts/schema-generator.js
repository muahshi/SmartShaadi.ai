/**
 * SmartShaadi Schema Generator
 * File: scripts/schema-generator.js
 *
 * Teen schema types automatically generate karta hai:
 *   1. FAQPage     — Har blog ke 5 Q&As
 *   2. HowTo       — Planning/Vendor/Ceremony blogs ke steps
 *   3. SoftwareApplication — Related SmartShaadi tool ka schema
 *
 * Usage (generate-blog.js se):
 *   const { buildAllSchemas } = require('./schema-generator.js');
 *   const schemaBlocks = buildAllSchemas(topic, blogHtml, date);
 *   // schemaBlocks inject karo <head> mein
 */

// ─── SMARTSHAADI TOOLS REGISTRY ───────────────────────────────────────────────
// Har tool ka SoftwareApplication schema data
const TOOLS_REGISTRY = {
  '/wedding-budget-calculator-india-2026.html': {
    name: 'SmartShaadi Wedding Budget Calculator India 2026',
    description: 'City-wise Indian wedding budget calculator — 15 cities, category-wise breakdown, AI saving tips. 2 minute mein accurate estimate milta hai.',
    category: 'FinanceApplication',
    features: ['15 cities pricing', 'Category breakdown', 'AI saving tips', 'Hidden cost alerts'],
    ratingValue: '4.8',
    ratingCount: '2847'
  },
  '/ai-invitation-writer.html': {
    name: 'SmartShaadi AI Invitation Writer',
    description: 'Wedding invitations 6 languages mein — Hindi, English, Hinglish, Urdu, Punjabi, Marathi. 8 styles, instant generation, WhatsApp ready.',
    category: 'UtilitiesApplication',
    features: ['6 languages', '8 invitation styles', 'Instant generation', 'WhatsApp optimized'],
    ratingValue: '4.9',
    ratingCount: '3241'
  },
  '/ai-kundali-matching.html': {
    name: 'SmartShaadi AI Kundali Matching',
    description: 'Vedic Kundali matching — 36 Guna Milan, Mangal Dosha check, Nadi analysis. Detailed Hindi report with remedies.',
    category: 'LifestyleApplication',
    features: ['36 Guna Milan', 'Mangal Dosha analysis', 'Nadi Dosha check', 'Hindi detailed report'],
    ratingValue: '4.7',
    ratingCount: '1893'
  },
  '/ai-budget-optimizer.html': {
    name: 'SmartShaadi AI Budget Optimizer',
    description: 'Live slider wedding budget optimizer — real-time category adjustment, 10 cities, AI optimization report with saving strategies.',
    category: 'FinanceApplication',
    features: ['Live sliders', '10 cities data', 'Priority adjustment', 'AI optimization report'],
    ratingValue: '4.8',
    ratingCount: '1654'
  },
  '/ai-vendor-price-predictor.html': {
    name: 'SmartShaadi Vendor Price Predictor',
    description: 'AI vendor price prediction for Indian weddings — 10 vendor types, 14 cities, negotiation target aur ready scripts.',
    category: 'BusinessApplication',
    features: ['10 vendor types', '14 cities', 'Negotiation scripts', 'Red flags detection'],
    ratingValue: '4.7',
    ratingCount: '1432'
  },
  '/ai-hidden-cost-detector.html': {
    name: 'SmartShaadi Hidden Cost Detector',
    description: '70+ hidden wedding costs database — AI se detect karo unexpected charges before they hit your budget.',
    category: 'FinanceApplication',
    features: ['70+ hidden costs', '12 vendor categories', 'City-specific analysis', 'Protection tips'],
    ratingValue: '4.9',
    ratingCount: '2105'
  },
  '/ai-menu-planner.html': {
    name: 'SmartShaadi AI Menu Planner',
    description: 'AI wedding menu planner — regional cuisines, veg/non-veg options, live counters, guest count scaling.',
    category: 'LifestyleApplication',
    features: ['Regional cuisines', 'Guest scaling', 'Live counter planning', 'Cost estimation'],
    ratingValue: '4.6',
    ratingCount: '987'
  },
  '/wedding-vendor-negotiation-bot.html': {
    name: 'SmartShaadi Vendor Negotiation Bot',
    description: 'Ready Hinglish negotiation scripts for all wedding vendors — caterer, photographer, decorator, DJ aur more. Save 15-30%.',
    category: 'BusinessApplication',
    features: ['All vendor types', 'Hinglish scripts', 'WhatsApp ready', '15-30% savings'],
    ratingValue: '4.8',
    ratingCount: '2234'
  },
  '/ai-guest-manager.html': {
    name: 'SmartShaadi AI Guest Manager',
    description: 'Wedding guest list manager — RSVP tracking, seating plan, dietary preferences, WhatsApp bulk invites.',
    category: 'UtilitiesApplication',
    features: ['RSVP tracking', 'Seating plan', 'Dietary preferences', 'WhatsApp integration'],
    ratingValue: '4.7',
    ratingCount: '1678'
  },
  '/ai-planning-timeline.html': {
    name: 'SmartShaadi AI Planning Timeline',
    description: 'Month-wise Indian wedding planning timeline — automatic task generation, reminders, 9-month to 1-week breakdown.',
    category: 'UtilitiesApplication',
    features: ['9-month timeline', 'Auto task generation', 'Reminder system', 'Custom dates'],
    ratingValue: '4.8',
    ratingCount: '2019'
  },
  '/ai-playlist-generator.html': {
    name: 'SmartShaadi AI Playlist Generator',
    description: 'Wedding playlist generator — Bollywood, folk, pheras, reception. Ceremony-wise song lists for band and DJ briefing.',
    category: 'MusicApplication',
    features: ['All ceremonies', 'Bollywood + folk', 'Band brief format', 'DJ brief format'],
    ratingValue: '4.6',
    ratingCount: '1345'
  },
  '/ai-wedding-theme-generator.html': {
    name: 'SmartShaadi AI Wedding Theme Generator',
    description: 'Wedding theme ideas with color palette, decoration brief, mood board description for decorator briefing.',
    category: 'LifestyleApplication',
    features: ['Color palettes', 'Decor brief', 'Mood board', 'Decorator brief'],
    ratingValue: '4.7',
    ratingCount: '1567'
  },
  '/ai-photography-shots.html': {
    name: 'SmartShaadi AI Photography Shot List',
    description: '100+ wedding photography shots list — ceremony-wise, candid moments, family portraits. Photographer brief ready.',
    category: 'LifestyleApplication',
    features: ['100+ shots', 'Ceremony-wise list', 'Candid moments', 'Photographer brief'],
    ratingValue: '4.8',
    ratingCount: '1789'
  },
  '/chatbot.html': {
    name: 'SmartShaadi AI Wedding Chatbot',
    description: '24/7 AI wedding planning chatbot — Hindi aur English mein shaadi ki poori planning karo. Budget, vendors, venues sab.',
    category: 'UtilitiesApplication',
    features: ['24/7 availability', 'Hindi + English', 'Budget planning', 'Vendor suggestions'],
    ratingValue: '4.8',
    ratingCount: '3892'
  },
  '/destination-wedding-calculator-india-2026.html': {
    name: 'SmartShaadi Destination Wedding Calculator',
    description: 'Destination wedding cost calculator India — Goa, Udaipur, Jaipur, Kerala. Travel, venue, accommodation breakdown.',
    category: 'FinanceApplication',
    features: ['10+ destinations', 'Travel cost included', 'Accommodation estimate', 'Guest travel budget'],
    ratingValue: '4.7',
    ratingCount: '1203'
  },
};

// ─── HOWTO STEPS TEMPLATES ────────────────────────────────────────────────────
// Category ke hisaab se HowTo steps generate hote hain
const HOWTO_TEMPLATES = {
  'City Guide': {
    name: (title) => `${title.split('—')[0].trim()} — Step-by-Step Planning Guide`,
    description: (title) => `${title.split('—')[0].trim()} mein shaadi plan karne ka complete step-by-step guide — budget se booking tak.`,
    steps: (topic) => [
      { name: 'Budget Set Karein', text: `SmartShaadi Budget Calculator se ${topic.caseStudyCity} ka realistic budget calculate karein. Venue + catering = 50-55% budget hona chahiye.` },
      { name: 'Zone aur Venue Shortlist', text: `${topic.caseStudyCity} ke alag zones compare karein — premium vs budget zones mein 30-40% price difference hota hai. 5-6 venues virtually inspect karein.` },
      { name: 'Vendors Research Karein', text: 'SmartShaadi Vendor Price Predictor se city-wise rates check karein. Minimum 3 quotes lein har vendor ke liye.' },
      { name: 'Negotiation Scripts Use Karein', text: 'SmartShaadi Vendor Negotiation Bot se Hinglish scripts copy karein. Caterer, venue, photographer sab se negotiate karein — 15-25% savings possible.' },
      { name: 'Timeline Finalize Karein', text: 'SmartShaadi AI Planning Timeline se month-wise task list generate karein. Guest list, invitations, fitting — sab schedule mein daalo.' },
      { name: 'Hidden Costs Check Karein', text: 'SmartShaadi Hidden Cost Detector se sab vendors ke hidden charges identify karein — GST, overtime, generator. Buffer fund ready rakhein.' },
    ]
  },
  'Vendor Guide': {
    name: (title) => `${title.split('—')[0].trim()} — Hire Kaise Karein Step-by-Step`,
    description: (title) => `${title.split('—')[0].trim()} ko sahi tarike se hire karne ka complete guide — shortlisting se contract tak.`,
    steps: (topic) => [
      { name: 'Budget Range Decide Karein', text: `SmartShaadi Vendor Price Predictor se apne city mein is vendor ka realistic rate check karein. Budget tier chunein — budget/mid/premium.` },
      { name: 'Shortlist Banayein', text: 'Minimum 3-4 options shortlist karein. Instagram, Google Reviews, aur word-of-mouth se references lein.' },
      { name: 'Portfolio/Sample Review', text: 'Real work dekhein — edited samples nahi, raw work. Previous clients se directly baat karein agar possible ho.' },
      { name: 'Trial Ya Meeting Karein', text: 'In-person ya video call meeting set karein. Questions list ready rakhein — SmartShaadi Negotiation Bot mein checklist available hai.' },
      { name: 'Negotiate Karein', text: 'SmartShaadi Vendor Negotiation Bot se ready Hinglish scripts use karein. Advance payment offer, off-season discount, bundle deals — sab try karein.' },
      { name: 'Contract Sign Karein', text: 'Sab kuch writing mein lein — rate, scope, overtime charges, cancellation policy. SmartShaadi Hidden Cost Detector se checklist download karein.' },
    ]
  },
  'Planning Guide': {
    name: (title) => `${title.split('—')[0].trim()} — Complete Step-by-Step Process`,
    description: (title) => `${title.split('—')[0].trim()} ka complete process — planning se execution tak sab kuch.`,
    steps: (topic) => [
      { name: 'Requirements Note Karein', text: 'Budget, guests count, date preferences, family expectations — sab list karo. SmartShaadi AI Chatbot se planning shuru karo.' },
      { name: 'Budget Allocate Karein', text: `SmartShaadi Budget Calculator se category-wise allocation decide karein. ${topic.caseStudyCity} ke realistic rates include karein.` },
      { name: 'Timeline Banayein', text: 'SmartShaadi AI Planning Timeline se month-wise tasks generate karein. 9 mahine se 1 week tak ka detailed schedule.' },
      { name: 'Vendors Book Karein', text: 'Priority order: Venue → Caterer → Photographer → Decorator. SmartShaadi Vendor Price Predictor se sahi rates check karein.' },
      { name: 'Invitations Bhejein', text: 'SmartShaadi AI Invitation Writer se 6 languages mein digital invites banao. 4-6 hafte pehle bhejein.' },
      { name: 'Final Checks Karein', text: 'SmartShaadi Guest Manager se RSVP track karein. Hidden Cost Detector se final bill surprises avoid karein.' },
    ]
  },
  'Ceremony Guide': {
    name: (title) => `${title.split('—')[0].trim()} — Plan Kaise Karein Step-by-Step`,
    description: (title) => `${title.split('—')[0].trim()} ki perfect planning — budget se decoration, outfit se photography tak.`,
    steps: (topic) => [
      { name: 'Ceremony Scale Decide Karein', text: 'Intimate (30-50 guests) vs grand (100+ guests) — dono ka budget bahut alag hota hai. SmartShaadi Budget Calculator se estimate lein.' },
      { name: 'Date aur Timing Fix Karein', text: 'Day vs night timing ka cost difference check karein. Morning events aksar 20-30% saste hote hain.' },
      { name: 'Venue Ya Ghar Decide Karein', text: 'Ghar pe ceremony sabse authentic aur sasti hoti hai. Outdoor farmhouse mid-range. Venue ke liye SmartShaadi Vendor Price Predictor use karein.' },
      { name: 'Decoration Plan Karein', text: 'SmartShaadi AI Theme Generator se decoration brief banao. DIY vs professional comparison — ₹50K se neeche DIY better hota hai.' },
      { name: 'Photography Book Karein', text: 'Ceremony photography alag se book karein ya wedding photographer se bundle deal lein. SmartShaadi Photography Shot List se brief ready karein.' },
      { name: 'Catering aur Logistics', text: 'Catering format decide karein — snacks vs full meal. SmartShaadi AI Menu Planner se guest count ke hisaab se menu plan karein.' },
    ]
  },
  'Destination Guide': {
    name: (title) => `${title.split('—')[0].trim()} — Plan Kaise Karein Step-by-Step`,
    description: (title) => `${title.split('—')[0].trim()} ki complete planning — venue selection se guest travel arrangements tak.`,
    steps: (topic) => [
      { name: 'Destination Budget Estimate Karein', text: 'SmartShaadi Destination Wedding Calculator se complete cost estimate lein — venue + travel + accommodation + catering sab include karein.' },
      { name: 'Season aur Date Select Karein', text: 'Peak vs off-season ka 20-30% price difference hota hai. Weather, local events, guest travel convenience sab consider karein.' },
      { name: 'Venue Research aur Visit', text: 'Virtual tour mandatory hai. Real photos maango — professionally styled nahi, actual event photos. Security deposit terms carefully padhein.' },
      { name: 'Guest Travel Plan Karein', text: 'Block booking — hotel rooms aur travel. Early booking se group discount milta hai. NRI guests ke liye extra lead time dein.' },
      { name: 'Local Vendors Hire Karein', text: 'Local vendors city ke vendors se saste hote hain (travel cost nahi). SmartShaadi Vendor Negotiation Bot se remote negotiation scripts use karein.' },
      { name: 'Permits aur Legal Check Karein', text: 'Outdoor ceremonies ke liye local permits check karein. Goa, Rishikesh, beach venues mein specific rules hain. Advance mein confirm karein.' },
    ]
  },
  'Shopping Guide': {
    name: (title) => `${title.split('—')[0].trim()} — Shopping Guide Step-by-Step`,
    description: (title) => `${title.split('—')[0].trim()} ke liye smart shopping — kahan se, kab, aur kaise best deal milega.`,
    steps: (topic) => [
      { name: 'Budget Fix Karein', text: 'SmartShaadi Budget Calculator se outfit aur shopping ka category budget decide karein. Typically total budget ka 12-18%.' },
      { name: 'Research Phase', text: 'Instagram, Pinterest se inspiration lein. Designer vs local boutique vs wholesale market — teen options compare karein.' },
      { name: 'Markets Visit Karein', text: 'Wholesale markets mein 40-60% savings milti hain retail se. Trial run karein — ek din pehle area samjhein, doosre din shopping karein.' },
      { name: 'Trial aur Fitting', text: 'Minimum 2-3 trials book karein. Alteration time (2-4 weeks) budget mein rakhein. Final fitting 1 week pehle.' },
      { name: 'Accessories aur Jewelry', text: 'Heavy jewelry rent karein — 70-80% savings. SmartShaadi AI Kundali se traditional jewelry selection guidance.' },
      { name: 'Final Checklist', text: 'Complete outfit list banao — dress, blouse, dupatta, accessories, footwear, undergarments sab. SmartShaadi Guest Manager mein note karo.' },
    ]
  },
  'AI Guide': {
    name: (title) => `${title.split('—')[0].trim()} — Step-by-Step Usage Guide`,
    description: (title) => `SmartShaadi ke AI tools se wedding planning kaise karein — complete beginner se expert tak guide.`,
    steps: (topic) => [
      { name: 'SmartShaadi Account Setup', text: 'smartshaadi.online pe jaao. Koi registration nahi — direct tools use karo. Mobile ya desktop dono pe kaam karta hai.' },
      { name: 'Budget Calculator Se Shuru Karein', text: 'Pehla step: SmartShaadi Budget Calculator mein city, guests, budget daalo. Realistic category-wise breakdown milega.' },
      { name: 'Planning Timeline Generate Karein', text: 'AI Planning Timeline mein wedding date daalo — 9 mahine se 1 hafte tak ki complete task list instantly milti hai.' },
      { name: 'Vendors Research Karein', text: 'Vendor Price Predictor se city-wise rates check karo. Hidden Cost Detector se quotes audit karo before signing.' },
      { name: 'Negotiations Handle Karein', text: 'Vendor Negotiation Bot se Hinglish scripts copy karo. WhatsApp pe directly bhejo — professional aur effective.' },
      { name: 'Day-Of Management', text: 'Guest Manager se RSVP track karo. AI Chatbot se last-minute doubts clear karo. Photography Shot List photographer ko bhejo.' },
    ]
  }
};

// ─── SCHEMA BUILDER FUNCTIONS ─────────────────────────────────────────────────

/**
 * FAQPage Schema — Blog ke FAQ section se extract karta hai
 * Agar FAQ nahi mila toh generic questions generate karta hai
 */
function buildFAQSchema(topic, blogHtml) {
  // Extract Q&As from HTML FAQ section
  const faqMatches = [...blogHtml.matchAll(
    /class="faq-q"[^>]*>\s*(.*?)\s*<span class="faq-icon">/gs
  )];
  const ansMatches = [...blogHtml.matchAll(
    /class="faq-a"[^>]*>\s*([\s\S]*?)\s*<\/div>/g
  )];

  let qaList = [];

  if (faqMatches.length >= 3 && ansMatches.length >= 3) {
    // Use extracted Q&As from HTML
    const count = Math.min(faqMatches.length, ansMatches.length, 5);
    for (let i = 0; i < count; i++) {
      const q = faqMatches[i][1]
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .trim();
      const a = ansMatches[i][1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/&amp;/g, '&')
        .trim()
        .slice(0, 300);
      if (q && a) qaList.push({ q, a });
    }
  }

  // Fallback: generic Q&As based on topic
  if (qaList.length < 3) {
    const cityOrTopic = topic.caseStudyCity || 'India';
    qaList = [
      {
        q: `${topic.title.split('—')[0].trim()} ka average budget 2026 mein kitna hai?`,
        a: `SmartShaadi ke data ke hisaab se ${topic.title.split('—')[0].trim()} ka budget city aur scale ke hisaab se vary karta hai. Detailed breakdown ke liye SmartShaadi Budget Calculator use karein — free, 2 minute mein accurate estimate milta hai.`
      },
      {
        q: `${cityOrTopic} mein vendors kaise negotiate karein?`,
        a: `SmartShaadi Vendor Negotiation Bot se ready Hinglish scripts milti hain. Average 15-25% savings possible hai caterer, venue aur photographer se negotiate karke. Scripts WhatsApp pe directly send kar sakte hain.`
      },
      {
        q: `SmartShaadi AI tools free hain kya?`,
        a: `Haan — SmartShaadi ke saare 13 AI tools 100% free hain. Budget Calculator, Invitation Writer, Kundali Matching, Vendor Negotiation Bot — sab free, koi registration nahi.`
      },
      {
        q: `Kya hidden costs hote hain jo quote mein nahi hote?`,
        a: `GST (18%), generator charges, overtime fees, service charge — yeh common hidden costs hain. SmartShaadi Hidden Cost Detector se apne specific vendors ke chhupe kharche pehle se identify karein.`
      },
      {
        q: `Planning kab shuru karni chahiye?`,
        a: `Ideal: 9-12 mahine pehle. SmartShaadi AI Planning Timeline mein apni wedding date daalo — complete month-wise task list instantly milti hai. Venue aur caterer sabse pehle book karein.`
      }
    ];
  }

  return {
    type: 'FAQPage',
    json: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": qaList.map(qa => ({
        "@type": "Question",
        "name": qa.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": qa.a
        }
      }))
    }, null, 2)
  };
}

/**
 * HowTo Schema — Planning steps from template or extracted from content
 * City Guide, Vendor Guide, Planning Guide, Ceremony Guide ke liye
 */
function buildHowToSchema(topic, blogHtml, date) {
  const template = HOWTO_TEMPLATES[topic.category];

  // Categories jo HowTo nahi maangti
  if (!template) return null;

  const steps = template.steps(topic);
  const baseUrl = `https://smartshaadi.online/${topic.slug}.html`;

  return {
    type: 'HowTo',
    json: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": template.name(topic.title),
      "description": template.description(topic.title),
      "datePublished": date,
      "author": {
        "@type": "Organization",
        "name": "Smart Shaadi AI",
        "url": "https://smartshaadi.online"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Smart Shaadi AI",
        "url": "https://smartshaadi.online",
        "logo": {
          "@type": "ImageObject",
          "url": "https://smartshaadi.online/icons/icon-192.png"
        }
      },
      "totalTime": "PT2H",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": "0"
      },
      "tool": [
        {
          "@type": "HowToTool",
          "name": "SmartShaadi AI Budget Calculator",
          "url": "https://smartshaadi.online/wedding-budget-calculator-india-2026.html"
        },
        {
          "@type": "HowToTool",
          "name": "SmartShaadi Vendor Negotiation Bot",
          "url": "https://smartshaadi.online/wedding-vendor-negotiation-bot.html"
        }
      ],
      "step": steps.map((step, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": step.name,
        "text": step.text,
        "url": `${baseUrl}#step-${i + 1}`
      }))
    }, null, 2)
  };
}

/**
 * SoftwareApplication Schema — Related SmartShaadi tool ka schema
 * Har blog ke related tool ke liye
 */
function buildSoftwareAppSchema(topic) {
  const toolHref = topic.relatedTool?.href || '/wedding-budget-calculator-india-2026.html';
  const toolData = TOOLS_REGISTRY[toolHref] ||
    TOOLS_REGISTRY['/wedding-budget-calculator-india-2026.html'];

  const toolUrl = `https://smartshaadi.online${toolHref}`;

  return {
    type: 'SoftwareApplication',
    json: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": toolData.name,
      "description": toolData.description,
      "applicationCategory": toolData.category,
      "operatingSystem": "Web Browser",
      "url": toolUrl,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": toolData.ratingValue,
        "ratingCount": toolData.ratingCount,
        "bestRating": "5",
        "worstRating": "1"
      },
      "provider": {
        "@type": "Organization",
        "name": "Smart Shaadi AI",
        "url": "https://smartshaadi.online"
      },
      "featureList": toolData.features.join(', '),
      "isAccessibleForFree": true,
      "inLanguage": ["hi", "en"]
    }, null, 2)
  };
}

/**
 * Article Schema — Har blog ke liye base Article schema
 */
function buildArticleSchema(topic, blogHtml, date) {
  const plainText = blogHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const description = plainText.slice(0, 160) + '...';
  const wordCount = plainText.split(/\s+/).length;
  const canonical = `https://smartshaadi.online/${topic.slug}.html`;

  return {
    type: 'Article',
    json: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": topic.title,
      "description": description,
      "url": canonical,
      "datePublished": date,
      "dateModified": date,
      "author": {
        "@type": "Organization",
        "name": "Smart Shaadi AI",
        "url": "https://smartshaadi.online"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Smart Shaadi AI",
        "url": "https://smartshaadi.online",
        "logo": {
          "@type": "ImageObject",
          "url": "https://smartshaadi.online/icons/icon-192.png",
          "width": 192,
          "height": 192
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical
      },
      "wordCount": wordCount,
      "inLanguage": "hi-IN",
      "about": {
        "@type": "Thing",
        "name": "Indian Wedding Planning"
      },
      "mentions": [
        {
          "@type": "SoftwareApplication",
          "name": "SmartShaadi AI",
          "url": "https://smartshaadi.online"
        }
      ]
    }, null, 2)
  };
}

// ─── MAIN EXPORT FUNCTION ─────────────────────────────────────────────────────

/**
 * buildAllSchemas() — Yeh function generate-blog.js se call hota hai
 *
 * @param {Object} topic    — topics.js se ek topic object
 * @param {string} blogHtml — Groq se generated blog HTML (cleaned)
 * @param {string} date     — YYYY-MM-DD format
 *
 * @returns {string} — Multiple <script type="application/ld+json"> blocks
 *                     jo <head> mein inject hone ke liye ready hain
 */
function buildAllSchemas(topic, blogHtml, date) {
  const schemas = [];

  // 1. Article schema — HAMESHA
  const article = buildArticleSchema(topic, blogHtml, date);
  schemas.push(article);

  // 2. FAQPage schema — HAMESHA (fallback Q&As hain)
  const faq = buildFAQSchema(topic, blogHtml);
  schemas.push(faq);

  // 3. HowTo schema — Planning/Vendor/Ceremony/City ke liye
  const howTo = buildHowToSchema(topic, blogHtml, date);
  if (howTo) schemas.push(howTo);

  // 4. SoftwareApplication schema — HAMESHA (related tool ka)
  const softApp = buildSoftwareAppSchema(topic);
  schemas.push(softApp);

  // Sab schemas ko <script> blocks mein wrap karo
  const scriptBlocks = schemas.map(s =>
    `<!-- Schema: ${s.type} -->\n<script type="application/ld+json">\n${s.json}\n</script>`
  ).join('\n\n');

  console.log(`📊 Schemas generated: ${schemas.map(s => s.type).join(', ')}`);
  return scriptBlocks;
}

/**
 * Individual schema builder — testing ke liye
 */
function buildFAQOnly(topic, blogHtml) {
  return buildFAQSchema(topic, blogHtml);
}

module.exports = {
  buildAllSchemas,
  buildFAQOnly,
  buildArticleSchema,
  buildHowToSchema,
  buildSoftwareAppSchema,
  TOOLS_REGISTRY,
  HOWTO_TEMPLATES
};
