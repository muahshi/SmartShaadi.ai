const crypto = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body || {};

    if (!razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Payment ID missing' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET not set');
      return res.status(500).json({ success: false, error: 'Server config error' });
    }

    // Signature verify only if order_id present (direct checkout mein nahi hota)
    if (razorpay_order_id && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
      if (expected !== razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Signature mismatch' });
      }
    }

    // HMAC token — self-verifying, no DB needed
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const payload   = razorpay_payment_id + '|' + expiresAt;
    const token     = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    console.log('Pro activated:', razorpay_payment_id);
    return res.status(200).json({ success: true, token, payment_id: razorpay_payment_id, expires_at: expiresAt });

  } catch (e) {
    console.error('verify-payment error:', e);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
