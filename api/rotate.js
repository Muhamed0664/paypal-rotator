import { Redis } from '@upstash/redis';

// أدخل إيميلات بايبال الخاصة بك هنا بالترتيب
const EMAILS = [
  "helenagill2@freenet.de",
  "ardjanzaimi@freenet.de",
  "helenagill2@freenet.de",
  "ardjanzaimi@freenet.de",
  "mertys66@freenet.de"
];

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // تفعيل CORS ليعمل مع شوبيفاي بدون مشاكل
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // جلب المؤشر الحالي من Upstash Redis
    let currentIndex = await redis.get('paypal_email_index');

    if (currentIndex === null || currentIndex === undefined) {
      currentIndex = 0;
    } else {
      currentIndex = parseInt(currentIndex, 10);
    }

    // في حالة طلب POST (عند إتمام الطلب لتغيير الإيميل للمرة القادمة)
    if (req.method === 'POST') {
      const nextIndex = (currentIndex + 1) % EMAILS.length;
      await redis.set('paypal_email_index', nextIndex);
      return res.status(200).json({ success: true, activeEmail: EMAILS[nextIndex], index: nextIndex });
    }

    // في حالة طلب GET (لجلب الإيميل الحالي فقط)
    const activeEmail = EMAILS[currentIndex % EMAILS.length];
    return res.status(200).json({ email: activeEmail, index: currentIndex });

  } catch (error) {
    // في حالة حدوث خطأ يتم إرجاع أول إيميل كاحتياط
    return res.status(200).json({ email: EMAILS[0], index: 0 });
  }
}
