// ═══════════════════════════════════════════════════════
// SmartShaadi — index.html Additions v3.0
// Paste this entire block just before </body> in index.html
// ═══════════════════════════════════════════════════════

// ── CSS (inject into <head> or add to existing <style>) ──
(function injectCSS(){
  var css = `
/* PWA Install Banner */
#ss-pwa-banner{
  position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(100px);
  width:calc(100% - 32px);max-width:480px;
  background:linear-gradient(135deg,#18141F,#1E1926);
  border:1.5px solid rgba(201,168,76,.3);border-radius:18px;
  padding:16px 18px;z-index:9000;
  box-shadow:0 16px 48px rgba(0,0,0,.6);
  display:flex;align-items:center;gap:14px;
  transition:transform .4s cubic-bezier(.34,1.56,.64,1);
  font-family:'DM Sans',sans-serif;
}
#ss-pwa-banner.show{transform:translateX(-50%) translateY(0);}
#ss-pwa-banner .pwa-icon{font-size:36px;flex-shrink:0;}
#ss-pwa-banner .pwa-text{flex:1;}
#ss-pwa-banner .pwa-title{font-size:14px;font-weight:700;color:#F5EFE0;margin-bottom:2px;}
#ss-pwa-banner .pwa-sub{font-size:11px;color:#9A9088;}
#ss-pwa-banner .pwa-btn{background:linear-gradient(135deg,#C9A84C,#E8C97A);border:none;border-radius:10px;padding:10px 18px;font-size:12px;font-weight:800;color:#0D0B0E;cursor:pointer;flex-shrink:0;font-family:'DM Sans',sans-serif;}
#ss-pwa-banner .pwa-close{background:none;border:none;color:rgba(245,239,224,.3);font-size:18px;cursor:pointer;padding:4px;line-height:1;flex-shrink:0;}

/* Notification Opt-in Strip */
#ss-notif-strip{
  display:none;
  background:rgba(201,168,76,.08);border-bottom:1px solid rgba(201,168,76,.15);
  padding:10px 20px;text-align:center;font-family:'DM Sans',sans-serif;
  align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;
}
#ss-notif-strip.show{display:flex;}
#ss-notif-strip p{font-size:12px;color:rgba(245,239,224,.7);margin:0;}
#ss-notif-strip button{background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.3);border-radius:20px;padding:5px 16px;font-size:11px;color:#C9A84C;cursor:pointer;font-weight:700;font-family:'DM Sans',sans-serif;}
#ss-notif-strip .ns-close{background:none;border:none;color:rgba(245,239,224,.3);font-size:16px;cursor:pointer;padding:0 4px;}

/* Hero Countdown Widget */
#ss-hero-countdown{
  display:none;
  background:linear-gradient(135deg,rgba(201,168,76,.1),rgba(201,168,76,.04));
  border:1px solid rgba(201,168,76,.25);border-radius:14px;
  padding:16px 20px;margin:20px 0;font-family:'DM Sans',sans-serif;
  cursor:pointer;transition:border-color .2s;
}
#ss-hero-countdown:hover{border-color:rgba(201,168,76,.4);}
#ss-hero-countdown.show{display:flex;align-items:center;gap:16px;}
#ss-hero-countdown .hcd-days{font-family:'Cormorant Garamond',Georgia,serif;font-size:42px;font-weight:700;color:#E8C97A;line-height:1;}
#ss-hero-countdown .hcd-text{flex:1;}
#ss-hero-countdown .hcd-title{font-size:11px;color:#C9A84C;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px;}
#ss-hero-countdown .hcd-sub{font-size:13px;color:rgba(245,239,224,.6);}
#ss-hero-countdown .hcd-arrow{color:rgba(201,168,76,.5);font-size:18px;}

/* Date Setup CTA (shown when no date set) */
#ss-date-cta{
  display:none;
  align-items:center;gap:10px;
  background:rgba(201,168,76,.06);
  border:1px dashed rgba(201,168,76,.25);border-radius:12px;
  padding:12px 16px;margin:16px 0;font-family:'DM Sans',sans-serif;
  cursor:pointer;transition:all .2s;
}
#ss-date-cta.show{display:flex;}
#ss-date-cta:hover{border-color:rgba(201,168,76,.5);background:rgba(201,168,76,.1);}
#ss-date-cta span{font-size:13px;color:rgba(245,239,224,.6);}
#ss-date-cta strong{color:#C9A84C;}

/* Date Picker Modal */
#ss-date-modal{
  position:fixed;inset:0;background:rgba(10,8,16,.95);
  z-index:9500;display:none;align-items:center;justify-content:center;padding:20px;
}
#ss-date-modal.show{display:flex;}
#ss-date-modal .sdm-inner{
  background:#18141F;border:1.5px solid rgba(201,168,76,.25);border-radius:20px;
  padding:28px 24px;max-width:380px;width:100%;text-align:center;
  font-family:'DM Sans',sans-serif;
}
#ss-date-modal h3{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.6rem;color:#F5EFE0;margin-bottom:6px;}
#ss-date-modal p{font-size:13px;color:#9A9088;margin-bottom:20px;}
#ss-date-modal input[type=date]{
  width:100%;background:#111018;border:1.5px solid rgba(201,168,76,.25);border-radius:10px;
  padding:12px 16px;color:#E8C97A;font-size:16px;font-weight:700;
  font-family:'DM Sans',sans-serif;outline:none;margin-bottom:16px;
  -webkit-appearance:none;
}
#ss-date-modal .sdm-btn{
  width:100%;background:linear-gradient(135deg,#C9A84C,#E8C97A);
  border:none;border-radius:10px;padding:14px;
  font-size:14px;font-weight:800;color:#0D0B0E;cursor:pointer;
  font-family:'DM Sans',sans-serif;
}
#ss-date-modal .sdm-skip{background:none;border:none;color:rgba(245,239,224,.3);font-size:12px;cursor:pointer;margin-top:10px;display:block;font-family:'DM Sans',sans-serif;}
  `;
  var el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
})();

// ── SERVICE WORKER REGISTER ──────────────────────────
if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/sw.js')
      .then(function(reg){ console.log('SW registered'); })
      .catch(function(e){ console.log('SW error:', e); });
  });
}

// ── PWA INSTALL BANNER ───────────────────────────────
(function(){
  var deferredPrompt = null;
  var banner = null;

  function createBanner(){
    if(document.getElementById('ss-pwa-banner')) return;
    var el = document.createElement('div');
    el.id = 'ss-pwa-banner';
    el.innerHTML = `
      <span class="pwa-icon">💍</span>
      <div class="pwa-text">
        <div class="pwa-title">SmartShaadi App Install Karo</div>
        <div class="pwa-sub">Home screen pe add karo — free, fast, offline bhi kaam karta hai</div>
      </div>
      <button class="pwa-btn" id="ss-pwa-install">Install</button>
      <button class="pwa-close" id="ss-pwa-close">✕</button>
    `;
    document.body.appendChild(el);

    document.getElementById('ss-pwa-install').addEventListener('click', function(){
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(result){
        if(result.outcome === 'accepted'){
          try{ localStorage.setItem('ss_pwa_installed','1'); }catch(e){}
        }
        deferredPrompt = null;
        hideBanner();
      });
    });

    document.getElementById('ss-pwa-close').addEventListener('click', function(){
      hideBanner();
      try{ localStorage.setItem('ss_pwa_dismissed', Date.now()); }catch(e){}
    });

    banner = el;
    setTimeout(function(){ el.classList.add('show'); }, 100);
  }

  function hideBanner(){
    if(banner){ banner.classList.remove('show'); }
  }

  function shouldShow(){
    try{
      if(localStorage.getItem('ss_pwa_installed')) return false;
      var dismissed = localStorage.getItem('ss_pwa_dismissed');
      if(dismissed && Date.now() - parseInt(dismissed) < 7*24*60*60*1000) return false;
    }catch(e){}
    return true;
  }

  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    if(!shouldShow()) return;
    // Show after 30 seconds or 50% scroll
    var shown = false;
    function show(){ if(!shown){ shown=true; createBanner(); } }
    setTimeout(show, 30000);
    window.addEventListener('scroll', function(){
      if(window.scrollY > document.body.scrollHeight * 0.4) show();
    }, {once:true});
  });
})();

// ── WEDDING COUNTDOWN ────────────────────────────────
(function(){
  var DATE_KEY = 'ss_wedding_date';
  var dateStr = null;
  try{ dateStr = localStorage.getItem(DATE_KEY); }catch(e){}

  function daysUntil(ds){
    var today = new Date(); today.setHours(0,0,0,0);
    var wed = new Date(ds);
    return Math.ceil((wed - today) / 86400000);
  }

  function getTaskMsg(days){
    if(days > 270) return 'Venue shortlisting ka best time hai! 🏛️';
    if(days > 180) return 'Photographer book karo — best ones fast fill up 📸';
    if(days > 120) return 'Invitations design shuru karo 💌';
    if(days > 90)  return 'Outfit shopping ka time hai 👗';
    if(days > 60)  return 'Decor aur caterer final karo 🌸';
    if(days > 30)  return 'Guest RSVP final count lo 👥';
    if(days > 14)  return 'Sab vendors ko confirm karo ✅';
    if(days > 7)   return 'Last minute checklist ready karo!';
    return 'Shaadi is week mein! Enjoy karo 🎉';
  }

  function injectCountdown(){
    // Find hero section and inject after h1
    var hero = document.querySelector('.hero-text') || document.querySelector('.hero') || document.querySelector('h1')?.parentElement;
    if(!hero) return;

    // Create countdown element
    var cd = document.createElement('div');
    cd.id = 'ss-hero-countdown';
    if(dateStr){
      var days = daysUntil(dateStr);
      if(days > 0){
        cd.innerHTML = `
          <div class="hcd-days">${days}</div>
          <div class="hcd-text">
            <div class="hcd-title">⏳ Din Baaki Hain</div>
            <div class="hcd-sub">${getTaskMsg(days)}</div>
          </div>
          <div class="hcd-arrow">→</div>
        `;
        cd.onclick = function(){ window.location.href='app.html#countdown'; };
        cd.classList.add('show');
      }
    } else {
      // No date set — show CTA
      var cta = document.createElement('div');
      cta.id = 'ss-date-cta';
      cta.classList.add('show');
      cta.innerHTML = `<span>📅 <strong>Wedding date set karein</strong> — countdown + reminders paayein</span><span style="color:#C9A84C;font-size:18px;">→</span>`;
      cta.onclick = showDateModal;
      hero.appendChild(cta);
      return;
    }

    // Insert after stats or after first p
    var stats = hero.querySelector('.stats') || hero.querySelector('p');
    if(stats && stats.nextSibling){
      hero.insertBefore(cd, stats.nextSibling);
    } else {
      hero.appendChild(cd);
    }
  }

  // Date Modal
  function showDateModal(){
    var existing = document.getElementById('ss-date-modal');
    if(existing){ existing.classList.add('show'); return; }

    var modal = document.createElement('div');
    modal.id = 'ss-date-modal';
    modal.innerHTML = `
      <div class="sdm-inner">
        <div style="font-size:48px;margin-bottom:12px;">💍</div>
        <h3>Shaadi Kab Hai?</h3>
        <p>Date set karein — personalized countdown, checklist aur reminders paayein</p>
        <input type="date" id="ss-date-input" min="${new Date().toISOString().split('T')[0]}">
        <button class="sdm-btn" id="ss-date-save">✨ Planning Shuru Karein</button>
        <button class="sdm-skip" id="ss-date-skip">Abhi nahi</button>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(function(){ modal.classList.add('show'); }, 50);

    document.getElementById('ss-date-save').addEventListener('click', function(){
      var val = document.getElementById('ss-date-input').value;
      if(!val){ alert('Date select karein!'); return; }
      try{ localStorage.setItem(DATE_KEY, val); }catch(e){}
      modal.classList.remove('show');
      dateStr = val;
      // Refresh countdown
      var oldCta = document.getElementById('ss-date-cta');
      if(oldCta) oldCta.remove();
      injectCountdown();
      // Show notification opt-in
      setTimeout(showNotifStrip, 1000);
    });

    document.getElementById('ss-date-skip').addEventListener('click', function(){
      modal.classList.remove('show');
    });

    modal.addEventListener('click', function(e){
      if(e.target === modal) modal.classList.remove('show');
    });
  }

  window.showDateModal = showDateModal;

  document.addEventListener('DOMContentLoaded', injectCountdown);
})();

// ── PUSH NOTIFICATION OPT-IN ─────────────────────────
function showNotifStrip(){
  if(!('Notification' in window)) return;
  if(Notification.permission === 'granted') return;
  if(Notification.permission === 'denied') return;
  try{ if(localStorage.getItem('ss_notif_asked')) return; }catch(e){}

  var strip = document.getElementById('ss-notif-strip');
  if(!strip){
    strip = document.createElement('div');
    strip.id = 'ss-notif-strip';
    strip.innerHTML = `
      <p>🔔 <strong>Wedding reminders paayein</strong> — important tasks miss mat karo</p>
      <button id="ss-notif-allow">Allow Notifications</button>
      <button class="ns-close" id="ss-notif-close">✕</button>
    `;
    // Insert at top of page
    var nav = document.querySelector('nav');
    if(nav && nav.nextSibling){
      document.body.insertBefore(strip, nav.nextSibling);
    } else {
      document.body.prepend(strip);
    }

    document.getElementById('ss-notif-allow').addEventListener('click', function(){
      Notification.requestPermission().then(function(perm){
        try{ localStorage.setItem('ss_notif_asked','1'); }catch(e){}
        strip.style.display = 'none';
        if(perm === 'granted'){
          // Schedule local reminder (fallback — works without server)
          scheduleLocalReminder();
        }
      });
    });

    document.getElementById('ss-notif-close').addEventListener('click', function(){
      try{ localStorage.setItem('ss_notif_asked','1'); }catch(e){}
      strip.style.display = 'none';
    });
  }
  strip.classList.add('show');
}

function scheduleLocalReminder(){
  // Simple local notification for next visit
  try{
    var dateStr = localStorage.getItem('ss_wedding_date');
    if(!dateStr) return;
    var days = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    var msg = days > 90 ? 'Venue aur photographer book karo!' : 
              days > 30 ? 'Guest RSVP confirm karo!' : 
              'Shaadi karib aa rahi hai — checklist check karo!';
    // Store for next visit notification
    localStorage.setItem('ss_pending_notif', JSON.stringify({
      title: 'SmartShaadi 💍 — ' + days + ' din baaki!',
      body: msg,
      time: Date.now() + 7*24*60*60*1000 // 1 week later
    }));
  }catch(e){}
}

// Check pending notifications on page load
(function checkPendingNotif(){
  if(Notification.permission !== 'granted') return;
  try{
    var pending = localStorage.getItem('ss_pending_notif');
    if(!pending) return;
    var data = JSON.parse(pending);
    if(Date.now() >= data.time){
      new Notification(data.title, { body: data.body, icon: '/icons/icon-192.png' });
      localStorage.removeItem('ss_pending_notif');
    }
  }catch(e){}
})();

// Show notif strip after 60 seconds for users with wedding date
setTimeout(function(){
  try{
    if(localStorage.getItem('ss_wedding_date') && !localStorage.getItem('ss_notif_asked')){
      showNotifStrip();
    }
  }catch(e){}
}, 60000);

// ── VENDOR SHOWCASE INJECT ───────────────────────────
// Injects 3 featured vendor cards before footer
(function injectVendorShowcase(){
  document.addEventListener('DOMContentLoaded', function(){
    var footer = document.querySelector('footer');
    if(!footer) return;

    var vendors = [
      {name:'Sharma Photography', city:'Delhi', cat:'Photography', rating:'4.9', price:'₹35,000+', badge:'🏆 Featured', phone:'9876543210', desc:'200+ weddings. Candid + cinematic packages.'},
      {name:'Royal Caterers', city:'Jaipur', cat:'Catering', rating:'4.8', price:'₹850/plate', badge:'⭐ Premium', phone:'9812345678', desc:'Rajasthani + North Indian. 100+ guests min.'},
      {name:'DJ Ravi Entertainment', city:'Bangalore', cat:'Music & DJ', rating:'4.9', price:'₹25,000+', badge:'🏆 Featured', phone:'9901234567', desc:'Bollywood + International. Live dhol available.'}
    ];

    var section = document.createElement('section');
    section.style.cssText = 'padding:3.5rem 2.4rem;background:var(--bg2,#111018);border-top:1px solid rgba(201,168,76,.1);';
    section.innerHTML = `
      <div style="max-width:1080px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.4rem;flex-wrap:wrap;gap:.8rem;">
          <div>
            <div style="font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:#C9A84C;margin-bottom:.4rem;">✦ SmartShaadi Certified</div>
            <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:1.8rem;font-weight:400;color:#F5EFE0;">Featured <em style="font-style:italic;color:#E8C97A;">Vendors</em></h2>
          </div>
          <a href="vendors/index.html" style="font-size:.82rem;color:#C9A84C;border:1px solid rgba(201,168,76,.25);padding:.45rem 1rem;border-radius:4px;text-decoration:none;background:rgba(201,168,76,.06);">Saare Vendors Dekho →</a>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;" id="ss-vendor-grid"></div>
        <div style="text-align:center;margin-top:1.8rem;padding:1.4rem;background:rgba(201,168,76,.05);border:1px dashed rgba(201,168,76,.2);border-radius:12px;">
          <p style="font-size:.9rem;color:#9A9088;margin-bottom:.8rem;">📢 Apna wedding business yahan list karein — 1,000+ couples daily visit karte hain</p>
          <a href="vendors/apply.html" style="background:#C9A84C;color:#0D0B0E;padding:.7rem 1.8rem;border-radius:4px;font-weight:700;font-size:.85rem;text-decoration:none;display:inline-block;">₹999/month se shuru → Abhi Apply Karein</a>
        </div>
      </div>
    `;
    footer.parentNode.insertBefore(section, footer);

    var grid = document.getElementById('ss-vendor-grid');
    vendors.forEach(function(v){
      var card = document.createElement('div');
      card.style.cssText = 'background:#18141F;border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:18px;transition:border-color .2s,transform .2s;cursor:default;';
      card.onmouseenter = function(){ this.style.borderColor='rgba(201,168,76,.3)'; this.style.transform='translateY(-3px)'; };
      card.onmouseleave = function(){ this.style.borderColor='rgba(255,255,255,.06)'; this.style.transform=''; };
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
          <div>
            <div style="font-size:14px;font-weight:700;color:#F5EFE0;margin-bottom:3px;">${v.name}</div>
            <div style="font-size:11px;color:#9A9088;">📍 ${v.city} · ${v.cat}</div>
          </div>
          <span style="font-size:10px;background:rgba(201,168,76,.12);color:#C9A84C;border:1px solid rgba(201,168,76,.25);padding:3px 8px;border-radius:20px;font-weight:700;">${v.badge}</span>
        </div>
        <div style="font-size:12px;color:rgba(245,239,224,.55);margin-bottom:12px;line-height:1.5;">${v.desc}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span style="font-size:13px;font-weight:700;color:#E8C97A;">${v.price}</span>
          <span style="font-size:11px;color:#C9A84C;">⭐ ${v.rating}</span>
        </div>
        <a href="https://wa.me/91${v.phone}?text=${encodeURIComponent('Hi! SmartShaadi se dekha. Inquiry karna tha.')}" target="_blank" style="display:block;background:linear-gradient(135deg,#25D366,#128C7E);border-radius:8px;padding:9px;text-align:center;font-size:12px;font-weight:700;color:#fff;text-decoration:none;">💬 WhatsApp Contact</a>
      `;
      grid.appendChild(card);
    });
  });
})();

console.log('✅ SmartShaadi v3.0 — PWA + Countdown + Notifications loaded');
