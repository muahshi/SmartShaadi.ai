// api/send-otp.js
const crypto = require('crypto');

// In-memory OTP store (Vercel serverless — resets on cold start, fine for 10 min OTPs)
// For production scale use KV store, but this works perfectly for current volume
const otpStore = {};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ success: false, error: 'Phone required' });

    // Clean phone number
    const cleanPhone = phone.toString().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, error: 'Invalid phone number' });
    }

    // Rate limit: 1 OTP per 60 seconds per number
    const existing = otpStore[cleanPhone];
    if (existing && Date.now() - existing.sentAt < 60000) {
      return res.status(429).json({ success: false, error: 'Please wait 60 seconds before requesting again' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP (hashed for security)
    const otpHash = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'fallback')
      .update(otp + cleanPhone).digest('hex');
    
    otpStore[cleanPhone] = { hash: otpHash, expiresAt, sentAt: Date.now() };

    // Send via MSG91
    const apiKey = process.env.MSG91_API_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    const senderId = process.env.MSG91_SENDER_ID || 'SMRTSH';

    if (!apiKey || !templateId) {
      console.error('MSG91 config missing');
      return res.status(500).json({ success: false, error: 'SMS config error' });
    }

    // MSG91 Send OTP API
    const msg91Url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${cleanPhone.slice(-10)}&authkey=${apiKey}&otp=${otp}&sender=${senderId}`;
    
    const smsRes = await fetch(msg91Url);
    const smsJson = await smsRes.json();
    
    console.log('MSG91 response:', JSON.stringify(smsJson));

    if (smsJson.type === 'success') {
      return res.status(200).json({ success: true, message: 'OTP sent' });
    } else {
      console.error('MSG91 error:', smsJson);
      return res.status(500).json({ success: false, error: 'SMS send failed: ' + (smsJson.message || 'Unknown error') });
    }

  } catch (e) {
    console.error('send-otp error:', e);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
