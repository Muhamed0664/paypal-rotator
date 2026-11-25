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
  "shopifyorder1403@freenet.de",
  "shopifyorder1404@freenet.de",
  "shopifyorder1404@freenet.de",
  "shopifyorder1405@freenet.de",
  "shopifyorder1405@freenet.de",
  "shopifyorder1406@freenet.de",
  "shopifyorder1407@freenet.de",
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
  "shopifyorder1420@freenet.de",
  "shopifyorder1420@freenet.de",
  "shopifyorder1430@freenet.de",
  "shopifyorder1430@freenet.de",
  "shopifyorder1431@freenet.de",
  "shopifyorder1432@freenet.de",
  "shopifyorder1433@freenet.de",
  "shopifyorder1434@freenet.de",
  "shopifyorder1434@freenet.de",
  "shopifyorder1435@freenet.de",
  "shopifyorder1435@freenet.de",
  "shopifyorder1435@freenet.de",
  "shopifyorder1447@freenet.de",
  "shopifyorder1447@freenet.de",
  "shopifyorder1448@freenet.de",
  "shopifyorder1448@freenet.de",
  "shopifyorder1449@freenet.de",
  "shopifyorder1450@freenet.de",
  "shopifyorder1451@freenet.de",
  "shopifyorder1451@freenet.de",
  "shopifyorder1452@freenet.de",
  "shopifyorder1453@freenet.de",
  "shopifyorder1454@freenet.de",
  "shopifyorder1455@freenet.de",
  "shopifyorder1456@freenet.de",
  "shopifyorder1457@freenet.de",
  "shopifyorder1458@freenet.de",
  "shopifyorder1459@freenet.de",
  "shopifyorder1460@freenet.de",
  "shopifyorder1461@freenet.de",
  "shopifyorder1462@freenet.de",
  "shopifyorder1463@freenet.de",
  "shopifyorder1464@freenet.de",
  "shopifyorder1465@freenet.de",
  "shopifyorder1466@freenet.de",
  "shopifyorder1467@freenet.de",
  "shopifyorder1468@freenet.de",
  "shopifyorder1469@freenet.de",
  "shopifyorder1470@freenet.de",
  "shopifyorder1471@freenet.de",
  "shopifyorder1472@freenet.de",
  "shopifyorder1479@freenet.de",
  "shopifyorder1480@freenet.de",
  "shopifyorder1481@freenet.de",
  "shopifyorder1482@freenet.de",
  "shopifyorder1483@freenet.de",
  "shopifyorder1484@freenet.de",
  "shopifyorder1485@freenet.de",
  "shopifyorder1486@freenet.de",
  "shopifyorder1487@freenet.de",
  "shopifyorder1488@freenet.de",
  "shopifyorder1489@freenet.de",
  "shopifyorder1490@freenet.de",
  "shopifyorder1491@freenet.de",
  "shopifyorder1492@freenet.de",
  "shopifyorder1493@freenet.de",
  "shopifyorder1494@freenet.de",
  "shopifyorder1495@freenet.de",
  "shopifyorder1496@freenet.de",
  "shopifyorder1497@freenet.de",
  "shopifyorder1498@freenet.de",
  "shopifyorder1499@freenet.de",
  "shopifyorder1500@freenet.de",
  "shopifyorder1501@freenet.de",
  "shopifyorder1502@freenet.de",
  "shopifyorder1503@freenet.de",
  "shopifyorder1504@freenet.de",
  "shopifyorder1513@freenet.de",
  "shopifyorder1514@freenet.de",
  "shopifyorder1515@freenet.de",
  "shopifyorder1516@freenet.de",
  "shopifyorder1517@freenet.de",
  "shopifyorder1518@freenet.de",
  "shopifyorder1519@freenet.de",
  "shopifyorder1520@freenet.de",
  "shopifyorder1521@freenet.de",
  "shopifyorder1522@freenet.de",
  "shopifyorder1523@freenet.de",
  "shopifyorder1524@freenet.de",
  "shopifyorder1525@freenet.de",
  "shopifyorder1525@freenet.de",
  "shopifyorder1527@freenet.de",
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
