import { Redis } from '@upstash/redis';

// أدخل إيميلات بايبال الخاصة بك هنا بالترتيب
const EMAILS = [
  "techindustriallimited@freenet.de",
  "shopifyorder1033@freenet.de",
  "shopifyorder1034@freenet.de",
  "shopifyorder1035@freenet.de",
  "shopifyorder1036@freenet.de",
  "shopifyorder1037@freenet.de",
  "shopifyorder1038@freenet.de",
  "shopifyorder1039@freenet.de",
  "shopifyorder1040@freenet.de",
  "shopifyorder1041@freenet.de",
  "shopifyorder1054@freenet.de",
  "shopifyorder1055@freenet.de",
  "shopifyorder1056@freenet.de",
  "shopifyorder1057@freenet.de",
  "shopifyorder1058@freenet.de",
  "shopifyorder1059@freenet.de",
  "shopifyorder1069@freenet.de",
  "shopifyorder1070@freenet.de",
  "shopifyorder1071@freenet.de",
  "shopifyorder1072@freenet.de",
  "shopifyorder1073@freenet.de",
  "shopifyorder1074@freenet.de",
  "shopifyorder1075@freenet.de",
  "shopifyorder1076@freenet.de",
  "shopifyorder1077@freenet.de",
  "shopifyorder1088@freenet.de",
  "shopifyorder1089@freenet.de",
  "shopifyorder1090@freenet.de",
  "shopifyorder1091@freenet.de",
  "shopifyorder1092@freenet.de",
  "shopifyorder1093@freenet.de",
  "shopifyorder1094@freenet.de",
  "shopifyorder1095@freenet.de",
  "shopifyorder1096@freenet.de",
  "shopifyorder1023@freenet.de",
  "shopifyorder1024@freenet.de",
  "shopifyorder1025@freenet.de",
  "shopifyorder1106@freenet.de",
  "shopifyorder1107@freenet.de",
  "shopifyorder1108@freenet.de",
  "shopifyorder1109@freenet.de",
  "shopifyorder1108@freenet.de",
  "shopifyorder1110@freenet.de",
  "shopifyorder1111@freenet.de",
  "shopifyorder1112@freenet.de",
  "shopifyorder1113@freenet.de",
  "shopifyorder1114@freenet.de",
  "shopifyorder1115@freenet.de",
  "shopifyorder1116@freenet.de",
  "shopifyorder1117@freenet.de",
  "shopifyorder1118@freenet.de",
  "shopifyorder1119@freenet.de",
  "shopifyorder1126@freenet.de",
  "shopifyorder1127@freenet.de",
  "shopifyorder1128@freenet.de",
  "shopifyorder1129@freenet.de",
  "shopifyorder1035@freenet.de",
  "shopifyorder1036@freenet.de",
  "shopifyorder1060@freenet.de",
  "shopifyorder1061@freenet.de",
  "shopifyorder1062@freenet.de",
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
