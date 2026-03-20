/* ══════════════════════════════════════════════════════
   SmartShaadi Pro Guard — v3
   Secure HMAC-based pro verification
   Include in: index.html, ai-tools.html, app.html
══════════════════════════════════════════════════════ */

const SS_PRO = (function () {

  const KEYS = {
    token:      'ss_pro_token',
    payment_id: 'ss_pro_pid',
    expires_at: 'ss_pro_exp',
    cache_time: 'ss_pro_cache',
    // Legacy keys (app.html internal) — keep in sync
    legacy_active: 'ss_pro_active',
    legacy_expiry: 'ss_pro_expiry',
  };

  const CACHE_MS = 30 * 60 * 1000; // 30 min server check cache

  function _get(k)  { try { return localStorage.getItem(k); } catch(e) { return null; } }
  function _set(k,v){ try { localStorage.setItem(k, v); } catch(e) {} }
  function _del(k)  { try { localStorage.removeItem(k); } catch(e) {} }

  function isProLocal() {
    // Check new token-based system
    var token = _get(KEYS.token);
    var pid   = _get(KEYS.payment_id);
    var exp   = parseInt(_get(KEYS.expires_at) || '0');
    if (token && pid && Date.now() < exp) return true;

    // Fallback: check legacy keys (app.html sets these)
    var legacyActive = _get(KEYS.legacy_active);
    var legacyExpiry = parseInt(_get(KEYS.legacy_expiry) || '0');
    if (legacyActive === 'true' && Date.now() < legacyExpiry) return true;

    return false;
  }

  function saveLocal(data) {
    _set(KEYS.token,      data.token);
    _set(KEYS.payment_id, data.payment_id);
    _set(KEYS.expires_at, String(data.expires_at));
    _set(KEYS.cache_time, String(Date.now()));
    // Also set legacy keys for app.html compatibility
    _set(KEYS.legacy_active, 'true');
    _set(KEYS.legacy_expiry, String(data.expires_at));
  }

  function clearLocal() {
    Object.values(KEYS).forEach(function(k) { _del(k); });
  }

  // Server verify (cached 30 min)
  async function verifyWithServer() {
    var token = _get(KEYS.token);
    var pid   = _get(KEYS.payment_id);
    var exp   = parseInt(_get(KEYS.expires_at) || '0');
    var cache = parseInt(_get(KEYS.cache_time) || '0');

    if (!token || !pid) return isProLocal(); // fallback to legacy
    if (Date.now() > exp) { clearLocal(); return false; }
    if (Date.now() - cache < CACHE_MS) return true; // cache valid

    try {
      var r = await fetch('/api/check-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, payment_id: pid, expires_at: exp }),
      });
      var json = await r.json();
      if (json.valid) {
        _set(KEYS.cache_time, String(Date.now()));
        return true;
      }
      if (json.reason === 'expired') clearLocal();
      return false;
    } catch (e) {
      // Network error — trust local
      return isProLocal();
    }
  }

  // Called after Razorpay payment success
  async function activateAfterPayment(payment_id, order_id, signature) {
    try {
      var r = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: payment_id,
          razorpay_order_id:   order_id,
          razorpay_signature:  signature,
        }),
      });
      var json = await r.json();
      if (json.success && json.token) {
        saveLocal({ token: json.token, payment_id: json.payment_id, expires_at: json.expires_at });
        return true;
      }
      return false;
    } catch (e) {
      console.warn('activateAfterPayment error:', e);
      return false;
    }
  }

  // Manual activation — for support use (e.g. payment ID se manually unlock)
  // Usage in console: SS_PRO.manualActivate('pay_XXXXXXX')
  async function manualActivate(payment_id) {
    if (!payment_id) return alert('Payment ID do');
    var ok = await activateAfterPayment(payment_id, null, null);
    if (ok) {
      alert('✅ Pro activated! Refresh karo.');
    } else {
      // Fallback: local only activation (server se token nahi mila)
      var exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
      _set(KEYS.legacy_active, 'true');
      _set(KEYS.legacy_expiry, String(exp));
      _set(KEYS.payment_id,    payment_id);
      _set(KEYS.expires_at,    String(exp));
      alert('✅ Pro activated (local). Refresh karo.');
    }
  }

  // Pro Modal
  function showModal(retUrl) {
    var existing = document.getElementById('ss-pro-modal');
    if (existing) {
      existing.style.display = 'flex';
      if (retUrl) existing.dataset.ret = retUrl;
      return;
    }
    var el = document.createElement('div');
    el.id = 'ss-pro-modal';
    el.dataset.ret = retUrl || '';
    el.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.93);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);';
    el.innerHTML = '<div style="background:#1a1200;border-radius:24px;padding:28px 22px;max-width:380px;width:100%;border:1.5px solid rgba(201,168,76,.4);text-align:center;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.6);">'
      + '<button onclick="document.getElementById(\'ss-pro-modal\').style.display=\'none\'" style="position:absolute;top:14px;right:16px;background:none;border:none;color:#5A4A20;font-size:22px;cursor:pointer;line-height:1;">✕</button>'
      + '<div style="font-size:52px;margin-bottom:10px;">🔒</div>'
      + '<div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#C9A84C;margin-bottom:8px;">Pro Feature</div>'
      + '<div style="font-size:14px;color:#B8A070;margin-bottom:20px;line-height:1.7;">Yeh AI tool <b style="color:#FFF8E8;">SmartShaadi Pro</b> mein available hai.<br>₹199/month mein 13 powerful AI tools unlock karo.</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:18px;text-align:left;">'
      + '<div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Invitation Writer</div>'
      + '<div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Kundali Matching</div>'
      + '<div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Budget AI</div>'
      + '<div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Menu Planner</div>'
      + '<div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ Theme Generator</div>'
      + '<div style="background:rgba(255,255,255,.05);border-radius:10px;padding:10px 12px;font-size:12px;color:#C9A84C;">✓ +8 aur tools</div>'
      + '</div>'
      + '<div style="background:rgba(201,168,76,.08);border-radius:12px;padding:12px;margin-bottom:18px;display:flex;align-items:center;justify-content:center;gap:16px;">'
      + '<span style="font-size:13px;color:#5A4A20;text-decoration:line-through;">₹999</span>'
      + '<span style="font-family:Georgia,serif;font-size:28px;color:#C9A84C;font-weight:700;">₹199<span style="font-size:13px;color:#8A7040;">/mo</span></span>'
      + '<span style="background:rgba(46,204,113,.15);color:#4ADE80;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;">80% OFF</span>'
      + '</div>'
      + '<button id="ss-pro-buy-btn" style="width:100%;padding:16px;background:linear-gradient(135deg,#C9A84C,#E8C97A);border:none;border-radius:14px;color:#0A0800;font-weight:800;font-size:16px;cursor:pointer;margin-bottom:10px;letter-spacing:.3px;box-shadow:0 6px 24px rgba(201,168,76,.3);">🔓 ₹199/mo — Abhi Unlock Karo</button>'
      + '<div style="font-size:11px;color:#5A4A20;">🔒 Razorpay secure · UPI, Card, Net Banking · Cancel anytime</div>'
      + '</div>';
    el.addEventListener('click', function(ev) { if (ev.target === el) el.style.display = 'none'; });
    document.body.appendChild(el);
    document.getElementById('ss-pro-buy-btn').onclick = function() { SS_PRO.startPayment(); };
  }

  // Start Razorpay from modal
  async function startPayment() {
    var modal = document.getElementById('ss-pro-modal');
    var retUrl = modal ? modal.dataset.ret : '';
    var btn = document.getElementById('ss-pro-buy-btn');
    if (btn) { btn.textContent = '⏳ Loading...'; btn.disabled = true; }

    try {
      var r = await fetch('/api/razorpay-config');
      if (!r.ok) throw new Error('Config error');
      var data = await r.json();
      var key = data.key;
      if (!key) throw new Error('Key missing');

      if (typeof Razorpay === 'undefined') {
        await new Promise(function(res, rej) {
          var sc = document.createElement('script');
          sc.src = 'https://checkout.razorpay.com/v1/checkout.js';
          sc.onload = res; sc.onerror = rej;
          document.head.appendChild(sc);
        });
      }

      var opts = {
        key: key,
        amount: 19900,
        currency: 'INR',
        name: 'SmartShaadi',
        description: 'Pro Plan — 13 AI Tools · 1 Month',
        image: 'https://www.smartshaadi.online/icons/icon-192.png',
        theme: { color: '#C9A84C' },
        modal: {
          ondismiss: function() {
            if (btn) { btn.textContent = '🔓 ₹199/mo — Abhi Unlock Karo'; btn.disabled = false; }
          }
        },
        handler: async function(resp) {
          if (btn) btn.textContent = '✅ Verifying...';
          // Always save locally first (safety net)
          var exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
          _set(KEYS.legacy_active, 'true');
          _set(KEYS.legacy_expiry, String(exp));
          _set(KEYS.payment_id,    resp.razorpay_payment_id);
          _set(KEYS.expires_at,    String(exp));

          // Then get secure token from server
          try {
            var ok = await activateAfterPayment(
              resp.razorpay_payment_id,
              resp.razorpay_order_id,
              resp.razorpay_signature
            );
            if (!ok) console.warn('Server token failed, using local fallback');
          } catch(e) {
            console.warn('Token fetch error:', e);
          }

          if (modal) modal.style.display = 'none';
          _onSuccess(retUrl);
        }
      };
      new Razorpay(opts).open();
    } catch (e) {
      alert('Payment load error: ' + e.message);
      if (btn) { btn.textContent = '🔓 ₹199/mo — Abhi Unlock Karo'; btn.disabled = false; }
    }
  }

  function _onSuccess(retUrl) {
    var t = document.getElementById('ss-pro-toast') || _makeToast();
    t.textContent = '🎉 Pro Active! Sab AI Tools unlock ho gaye!';
    t.style.opacity = '1';
    setTimeout(function() { t.style.opacity = '0'; }, 4000);
    setTimeout(function() {
      if (retUrl) window.location.href = retUrl;
      else window.location.reload();
    }, 1200);
  }

  function _makeToast() {
    var t = document.createElement('div');
    t.id = 'ss-pro-toast';
    t.style.cssText = 'position:fixed;bottom:6rem;left:50%;transform:translateX(-50%);z-index:10000;background:#4ADE80;color:#0a0800;padding:14px 24px;border-radius:12px;font-weight:800;font-size:15px;opacity:0;transition:opacity .4s;pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(74,222,128,.4);';
    document.body.appendChild(t);
    return t;
  }

  // Main gate — use everywhere: onclick="proUse('/tool.html', event)"
  async function gate(url, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (isProLocal()) {
      verifyWithServer(); // background check
      if (url) window.location.href = url;
      return true;
    }
    showModal(url);
    return false;
  }

  return {
    isProLocal,
    verifyWithServer,
    activateAfterPayment,
    saveLocal,
    clearLocal,
    manualActivate,
    showModal,
    startPayment,
    gate,
    _onSuccess,
  };

})();

// Global shortcuts — HTML onclick="" mein use hote hain
function proUse(url, e)    { SS_PRO.gate(url, e); }
function goProTool(url, e) { SS_PRO.gate(url, e); }
