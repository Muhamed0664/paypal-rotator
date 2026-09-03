export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // أدخل إيميلات بايبال الخاصة بك هنا بالترتيب
  const EMAILS = [
    "email1@paypal.com",
    "email2@paypal.com",
    "email3@paypal.com"
  ];

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return res.status(500).json({ error: "Missing Upstash Environment Variables" });
  }

  try {
    const getRes = await fetch(${url}/get/paypal_email_index, {
      headers: { Authorization: Bearer ${token} }
    });
    const getData = await getRes.json();
    
    let currentIndex = getData.result ? parseInt(getData.result, 10) : 0;
    if (isNaN(currentIndex)) currentIndex = 0;

    if (req.method === 'POST') {
      const nextIndex = (currentIndex + 1) % EMAILS.length;
      await fetch(${url}/set/paypal_email_index/${nextIndex}, {
        headers: { Authorization: Bearer ${token} }
      });
      return res.status(200).json({ success: true, activeEmail: EMAILS[nextIndex], index: nextIndex });
    }

    const activeEmail = EMAILS[currentIndex % EMAILS.length];
    return res.status(200).json({ email: activeEmail, index: currentIndex });

  } catch (error) {
    return res.status(200).json({ email: EMAILS[0], index: 0 });
  }
}
