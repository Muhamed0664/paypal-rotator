import { Redis } from '@upstash/redis';

// أدخل إيميلات باي بال الخاصة بك هنا بالترتيب
const EMAILS = [
  "email1@paypal.com",
  "email2@paypal.com",
  "email3@paypal.com"
];

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // تفعيل CORS ليعمل الكود مع شوبيفاي بدون مشاكل
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

    if (req.method === 'POST') {
      // عند الانتهاء من المعاملة (POST)، ننتقل للإيميل التالي
      const nextIndex = (currentIndex + 1) % EMAILS.length;
      await redis.set('paypal_email_index', nextIndex);
      return res.status(200).json({ success: true, activeEmail: EMAILS[nextIndex], index: nextIndex });
    }

    // عند التحميل العادي للصفحة (GET)، نرجع الإيميل الحالي دون تغيير الترتيب
    const activeEmail = EMAILS[currentIndex % EMAILS.length];
    return res.status(200).json({ email: activeEmail, index: currentIndex });

  } catch (error) {
    console.error("Redis Error:", error);
    // إيميل احتياطي في حال حدوث خطأ في الاتصال
    return res.status(200).json({ email: EMAILS[0], index: 0 });
  }
}
