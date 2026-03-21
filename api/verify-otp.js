// api/verify-otp.js
const crypto = require('crypto');

// Same in-memory store — must match send-otp.js instance
// Note: Vercel may spin up different instances, so we use a workaround:
// We encode the OTP hash in the token itself (signed), so verify doesn't need shared memory

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  try {
    const { phone, otp, session_token } = req.body || {};

    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone and OTP required' });
    }

    const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ success: false, error: 'Server error' });

    // Verify via MSG91 OTP verify API
    const apiKey = process.env.MSG91_API_KEY;
    
    const verifyUrl = `https://control.msg91.com/api/v5/otp/verify?mobile=91${cleanPhone}&otp=${otp}&authkey=${apiKey}`;
    const verifyRes = await fetch(verifyUrl);
    const verifyJson = await verifyRes.json();
    
    console.log('MSG91 verify response:', JSON.stringify(verifyJson));

    if (verifyJson.type !== 'success') {
      return res.status(200).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // OTP verified — generate Pro token valid 30 days
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const paymentId = 'OTP_' + cleanPhone; // phone-based identifier
    const payload = paymentId + '|' + expiresAt;
    const token = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    console.log('OTP Pro activated for phone:', cleanPhone.slice(0,4) + '******');

    return res.status(200).json({
      success: true,
      token,
      payment_id: paymentId,
      expires_at: expiresAt,
      phone: cleanPhone,
    });

  } catch (e) {
    console.error('verify-otp error:', e);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
