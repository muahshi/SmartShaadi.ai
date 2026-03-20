const crypto = require('crypto');

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.smartshaadi.online');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ error: 'Payment ID missing' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ error: 'Server config error' });

    // ── Razorpay signature verify (agar order_id hai) ──
    if (razorpay_order_id && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expected = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
      if (expected !== razorpay_signature) {
        return res.status(400).json({ error: 'Payment verification failed' });
      }
    }

    // ── HMAC token banao — self-verifying, no DB needed ──
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 din
    const payload = `${razorpay_payment_id}|${expiresAt}`;
    const token = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return res.status(200).json({
      success: true,
      token,
      payment_id: razorpay_payment_id,
      expires_at: expiresAt,
    });

  } catch (e) {
    console.error('verify-payment error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
