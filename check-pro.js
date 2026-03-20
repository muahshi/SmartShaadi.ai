const crypto = require('crypto');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.smartshaadi.online');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { token, payment_id, expires_at } = req.body;

    if (!token || !payment_id || !expires_at) {
      return res.status(400).json({ valid: false, reason: 'Missing fields' });
    }

    // Expiry check
    if (Date.now() > parseInt(expires_at)) {
      return res.status(200).json({ valid: false, reason: 'expired' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ valid: false, reason: 'Server error' });

    // Token verify — same HMAC as verify-payment.js
    const payload = `${payment_id}|${expires_at}`;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (expected !== token) {
      return res.status(200).json({ valid: false, reason: 'invalid_token' });
    }

    return res.status(200).json({ valid: true, expires_at: parseInt(expires_at) });

  } catch (e) {
    console.error('check-pro error:', e);
    return res.status(500).json({ valid: false, reason: 'server_error' });
  }
};
