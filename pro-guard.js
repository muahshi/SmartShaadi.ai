/* ══════════════════════════════════════════
   SmartShaadi Pro Guard — v2 (HMAC Secure)
   Include this before any pro check logic
══════════════════════════════════════════ */

const SS_PRO = (function () {

  const KEYS = {
    token:      'ss_pro_token',
    payment_id: 'ss_pro_pid',
    expires_at: 'ss_pro_exp',
    cache_time: 'ss_pro_cache', // last server check timestamp
  };

  // Cache: server check karne ke baad 30 min tak localStorage trust karo
  const CACHE_DURATION = 30 * 60 * 1000;

  function getLocal() {
    try {
      return {
        token:      localStorage.getItem(KEYS.token),
        payment_id: localStorage.getItem(KEYS.payment_id),
        expires_at: parseInt(localStorage.getItem(KEYS.expires_at) || '0'),
        cache_time: parseInt(localStorage.getItem(KEYS.cache_time) || '0'),
      };
    } catch (e) { return {}; }
  }

  function clearLocal() {
    try {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }

  function saveLocal(data) {
    try {
      localStorage.setItem(KEYS.token,      data.token);
      localStorage.setItem(KEYS.payment_id, data.payment_id);
      localStorage.setItem(KEYS.expires_at, String(data.expires_at));
      localStorage.setItem(KEYS.cache_time, String(Date.now()));
    } catch (e) {}
  }

  // Quick local check (no server call) — for UI rendering
  function isProLocal() {
    try {
      var d = getLocal();
      return !!(d.token && d.payment_id && Date.now() < d.expires_at);
    } catch (e) { return false; }
  }

  // Full server verify — called once per 30 mins
  async function verifyWithServer() {
    var d = getLocal();
    if (!d.token || !d.payment_id || !d.expires_at) return false;
    if (Date.now() > d.expires_at) { clearLocal(); return false; }

    // Cache valid? Skip server call
    if (Date.now() - d.cache_time < CACHE_DURATION) return true;

    try {
      var r = await fetch('/api/check-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token:      d.token,
          payment_id: d.payment_id,
          expires_at: d.expires_at,
        }),
      });
      var json = await r.json();
      if (json.valid) {
        // Refresh cache timestamp
        localStorage.setItem(KEYS.cache_time, String(Date.now()));
        return true;
      } else {
        if (json.reason === 'expired') clearLocal();
        return false;
      }
    } catch (e) {
      // Network error — trust local cache temporarily
      return isProLocal();
    }
  }

  // After payment — verify with server and save token
  async function activateAfterPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature) {
    var r = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ razorpay_payment_id, razorpay_order_id, razorpay_signature }),
    });
    var json = await r.json();
    if (json.success && json.token) {
      saveLocal({
        token:      json.token,
        payment_id: json.payment_id,
        expires_at: json.expires_at,
      });
      return true;
    }
    return false;
  }

  // Show Pro Modal
  function showModal(retUrl) {
    var existing = document.getElementById('ss-pro-modal');
    if (existing) { existing.style.display = 'flex'; if (retUrl) existing.dataset.ret = retUrl || ''; return; }
    var el = document.createElement('div');
    el.id = 'ss-pro-modal';
    el.dataset.ret = retUrl || '';
    el.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.93);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);';
    el.innerHTML = `
      <div style="background:#1a1200;border-radius:24px;padding:28px 22px;max-width:380px;width:100%;border:1.5px solid rgba(201,168,76,.4);text-align:center;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.6);">
        <button onclick="document.getElementById('ss-pro-modal').style.display='none'" style="position:absolute;top:14px;right:16px;background:none;border:none;color:#5A4A20;font-size:22px;cursor:pointer;line-height:1;">✕</button>
        <div style="font-size:52px;margin-bottom:10px;">🔒</div>
        <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#C9A84C;margin-bottom:8px;">Pro Feature</div>
        <div style="font-size:14px;color:#B8A070;margin-bottom:20px;line-height:1.7;">Yeh AI tool <b style="color:#FFF8E8;">SmartShaadi Pro</b> mein available hai.<br>₹199/month mein 13 powerful AI tools unlock karo.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px;text-align:left;">
          <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Invitation Writer</div>
          <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Kundali Matching</div>
          <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Budget AI</div>
          <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Menu Planner</div>
          <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Theme Generator</div>
          <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ +8 aur tools</div>
        </div>
        <div style="background:rgba(201,168,76,.08);border-radius:12px;padding:12px;margin-bottom:18px;display:flex;align-items:center;justify-content:center;gap:16px;">
          <span style="font-size:13px;color:#5A4A20;text-decoration:line-through;">₹999</span>
          <span style="font-family:Georgia,serif;font-size:28px;color:#C9A84C;font-weight:700;">₹199<span style="font-size:13px;color:#8A7040;">/mo</span></span>
          <span style="background:rgba(46,204,113,.15);color:#4ADE80;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;">80% OFF</span>
        </div>
        <button id="ss-pro-buy-btn" style="width:100%;padding:16px;background:linear-gradient(135deg,#C9A84C,#E8C97A);border:none;border-radius:14px;color:#0A0800;font-weight:800;font-size:16px;cursor:pointer;margin-bottom:10px;letter-spacing:.3px;box-shadow:0 6px 24px rgba(201,168,76,.3);">
          🔓 ₹199/mo — Abhi Unlock Karo
        </button>
        <div style="font-size:11px;color:#5A4A20;">🔒 Razorpay secure · UPI, Card, Net Banking · Cancel anytime</div>
      </div>`;
    el.addEventListener('click', function (ev) { if (ev.target === el) el.style.display = 'none'; });
    document.body.appendChild(el);
    // Wire buy button
    document.getElementById('ss-pro-buy-btn').onclick = function () { SS_PRO.startPayment(); };
  }

  // Start Razorpay payment
  async function startPayment() {
    var modal = document.getElementById('ss-pro-modal');
    var retUrl = modal ? modal.dataset.ret : '';
    var btn = document.getElementById('ss-pro-buy-btn');
    if (btn) { btn.textContent = '⏳ Loading...'; btn.disabled = true; }

    try {
      var r = await fetch('/api/razorpay-config');
      var { key } = await r.json();
      if (!key) throw new Error('Key not found');

      if (typeof Razorpay === 'undefined') {
        await new Promise((res, rej) => {
          var sc = document.createElement('script');
          sc.src = 'https://checkout.razorpay.com/v1/checkout.js';
          sc.onload = res; sc.onerror = rej;
          document.head.appendChild(sc);
        });
      }

      var opts = {
        key,
        amount: 19900,
        currency: 'INR',
        name: 'SmartShaadi',
        description: 'Pro Plan — 13 AI Tools · 1 Month',
        image: 'https://www.smartshaadi.online/icons/icon-192.png',
        theme: { color: '#C9A84C' },
        modal: {
          ondismiss: function () {
            if (btn) { btn.textContent = '🔓 ₹199/mo — Abhi Unlock Karo'; btn.disabled = false; }
          }
        },
        handler: async function (resp) {
          if (btn) { btn.textContent = '✅ Verifying...'; }
          var ok = await SS_PRO.activateAfterPayment(
            resp.razorpay_payment_id,
            resp.razorpay_order_id,
            resp.razorpay_signature
          );
          if (ok) {
            if (modal) modal.style.display = 'none';
            SS_PRO._onSuccess(retUrl);
          } else {
            alert('Payment verification failed. Screenshot le lo aur contact karo.');
          }
        }
      };
      new Razorpay(opts).open();
    } catch (e) {
      alert('Payment load error: ' + e.message);
      if (btn) { btn.textContent = '🔓 ₹199/mo — Abhi Unlock Karo'; btn.disabled = false; }
    }
  }

  // Called after successful payment
  function _onSuccess(retUrl) {
    // Show success toast
    var t = document.getElementById('ss-pro-toast') || _makeToast();
    t.textContent = '🎉 Pro Active! Sab AI Tools unlock ho gaye!';
    t.style.opacity = '1';
    setTimeout(function () { t.style.opacity = '0'; }, 4000);
    // Redirect if retUrl given
    if (retUrl) {
      setTimeout(function () { window.location.href = retUrl; }, 1200);
    } else {
      // Refresh page to update UI
      setTimeout(function () { window.location.reload(); }, 1200);
    }
  }

  function _makeToast() {
    var t = document.createElement('div');
    t.id = 'ss-pro-toast';
    t.style.cssText = 'position:fixed;bottom:6rem;left:50%;transform:translateX(-50%);z-index:10000;background:#4ADE80;color:#0a0800;padding:14px 24px;border-radius:12px;font-weight:800;font-size:15px;opacity:0;transition:opacity .4s;pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(74,222,128,.4);';
    document.body.appendChild(t);
    return t;
  }

  // Main gate function — use this everywhere
  async function gate(url, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var localOk = isProLocal();
    if (localOk) {
      // Verify in background, open immediately
      verifyWithServer(); // fire and forget
      if (url) window.location.href = url;
      return true;
    }
    // Not pro — show modal
    showModal(url);
    return false;
  }

  return {
    isProLocal,
    verifyWithServer,
    activateAfterPayment,
    showModal,
    startPayment,
    gate,
    clearLocal,
    _onSuccess,
  };

})();

// Global shortcuts used in HTML onclick=""
function proUse(url, e) { SS_PRO.gate(url, e); }
function goProTool(url, e) { SS_PRO.gate(url, e); }
