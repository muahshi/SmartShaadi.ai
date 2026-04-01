// ─── UPDATE blogs.html (REWRITTEN FOR STABILITY) ──────────────────────────────
function addToBlogsPage(topic, date) {
  const p = path.join(process.cwd(), 'blogs.html');
  if (!fs.existsSync(p)) { console.warn('⚠️  blogs.html not found at root.'); return; }
  
  let content = fs.readFileSync(p, 'utf-8');
  if (content.includes(topic.slug + '.html')) { 
    console.log('ℹ️  Card already exists in blogs.html. Skipping.'); 
    return; 
  }

  const card = `
    <a href="${topic.slug}.html" class="acard reveal" data-cat="${topic.catTag}" data-search="${topic.searchTerms}">
      <div class="acard-thumb"><div class="acard-thumb-bg" style="background:${topic.gradient}"></div><span class="acard-badge" style="background:rgba(126,211,160,.85);color:#08060E">🆕 NEW</span><span class="acard-thumb-icon">${topic.emoji}</span><div class="acard-thumb-overlay">${topic.category} • ${topic.readTime}</div></div>
      <div class="acard-body"><span class="acard-cat">${topic.category}</span><div class="acard-title">${topic.title}</div><div class="acard-desc">SmartShaadi AI Team ka in-depth guide — real data, honest pricing, Hinglish mein. Published ${date}.</div><div class="acard-footer"><div class="acard-read">Read Guide →</div><div class="acard-meta">${topic.readTime}</div></div></div>
    </a>`;

  // TIP: blogs.html mein jahan cards shuru hote hain wahan ye comment daal dein: // Agar marker nahi mila toh purane logic (last </a>) par fall back karega
  if (content.includes('')) {
      content = content.replace('', '' + card);
  } else {
      const ins = content.lastIndexOf('</a>');
      if (ins !== -1) {
          content = content.slice(0, ins + 4) + card + content.slice(ins + 4);
      } else {
          console.warn('⚠️  Could not find any </a> tag to inject card.');
          return;
      }
  }

  fs.writeFileSync(p, content, 'utf-8');
  console.log('✅ blogs.html — Successfully updated with new card');
}

// ─── UPDATE sitemap.xml (REWRITTEN) ───────────────────────────────────────────
function updateSitemap(topic, date) {
  const p = path.join(process.cwd(), 'sitemap.xml');
  if (!fs.existsSync(p)) { console.warn('⚠️  sitemap.xml not found at root.'); return; }
  
  let sm = fs.readFileSync(p, 'utf-8');
  const url = `https://smartshaadi.online/${topic.slug}.html`;
  
  if (sm.includes(url)) { 
    console.log('ℹ️  URL already in sitemap.'); 
    return; 
  }

  const entry = `  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>\n</urlset>`;

  sm = sm.replace('</urlset>', entry);
  fs.writeFileSync(p, sm, 'utf-8');
  console.log('✅ sitemap.xml — Successfully updated');
}

// ─── UPDATE url-map.json (PATH FIX) ──────────────────────────────────────────
function updateUrlMap(topic) {
  // dirname hata kar cwd (root) use kar rahe hain
  const p = path.join(process.cwd(), 'scripts', 'url-map.json'); 
  let map = {};
  if (fs.existsSync(p)) {
      try { map = JSON.parse(fs.readFileSync(p, 'utf-8')); } catch(e) { map = {}; }
  }
  
  const url = `https://smartshaadi.online/${topic.slug}.html`;
  if (!map[url]) {
    map[url] = { 
        slug: topic.slug, 
        title: topic.title, 
        keywords: topic.searchTerms.split(' ').filter(w => w.length > 4).slice(0, 5) 
    };
    fs.writeFileSync(p, JSON.stringify(map, null, 2), 'utf-8');
    console.log('✅ url-map.json — Successfully updated');
  }
}
