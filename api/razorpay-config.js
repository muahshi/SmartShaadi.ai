module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID
  });
};