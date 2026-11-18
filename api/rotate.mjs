import { Redis } from '@upstash/redis';

// أدخل إيميلات بايبال الخاصة بك هنا بالترتيب
const EMAILS = [
  "shopifyorder1342@freenet.de",
  "shopifyorder1389@freenet.de",
  "shopifyorder1390@freenet.de",
  "shopifyorder1391@freenet.de",
  "shopifyorder1392@freenet.de",
  "shopifyorder1393@freenet.de",
  "shopifyorder1394@freenet.de",
  "shopifyorder1395@freenet.de",
  "shopifyorder1396@freenet.de",
  "shopifyorder1397@freenet.de",
  "shopifyorder1398@freenet.de",
  "shopifyorder1399@freenet.de",
  "shopifyorder1400@freenet.de",
  "shopifyorder1400@freenet.de",
  "shopifyorder1401@freenet.de",
  "shopifyorder1401@freenet.de",
  "shopifyorder1402@freenet.de",
  "shopifyorder1402@freenet.de",
  "shopifyorder1403@freenet.de",
  "shopifyorder1404@freenet.de",
  "shopifyorder1405@freenet.de",
  "shopifyorder1406@freenet.de",
  "shopifyorder1407@freenet.de",
  "shopifyorder1408@freenet.de",
  "shopifyorder1409@freenet.de",
  "shopifyorder1410@freenet.de",
  "shopifyorder1411@freenet.de",
  "shopifyorder1412@freenet.de",
  "shopifyorder1413@freenet.de",
  "shopifyorder1414@freenet.de",
  "shopifyorder1415@freenet.de",
  "shopifyorder1416@freenet.de",
  "shopifyorder1417@freenet.de",
  "shopifyorder1418@freenet.de",
  "shopifyorder1419@freenet.de",
  "shopifyorder1420@freenet.de",
  "shopifyorder1042@freenet.de"
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
