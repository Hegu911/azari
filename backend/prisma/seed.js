const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  // Admin
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@perfumeluxury.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@perfumeluxury.com', password: adminPassword, role: 'super_admin' },
  });
  console.log('Admin created:', admin.email);

  // Users
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { name: 'Nicat Rəhimli', email: 'user@example.com', password: userPassword, phone: '+994500000001' },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { name: 'Ayla Kərimova', email: 'alice@example.com', password: userPassword, phone: '+994500000002' },
  });
  console.log('Users created:', user.email, user2.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'oriental' }, update: { name: 'Şərq', description: 'Zəngin ədviyyat və qatranlarla isti, ekzotik və həssas ətirlər' }, create: { name: 'Şərq', slug: 'oriental', description: 'Zəngin ədviyyat və qatranlarla isti, ekzotik və həssas ətirlər' } }),
    prisma.category.upsert({ where: { slug: 'floral' }, update: { name: 'Çiçək', description: 'Təzə çiçəklərdən ilhamlanan zərif və romantik qoxular' }, create: { name: 'Çiçək', slug: 'floral', description: 'Təzə çiçəklərdən ilhamlanan zərif və romantik qoxular' } }),
    prisma.category.upsert({ where: { slug: 'woody' }, update: { name: 'Odunsu', description: 'Ağac notları ilə torpaq və sofistike aromalar' }, create: { name: 'Odunsu', slug: 'woody', description: 'Ağac notları ilə torpaq və sofistike aromalar' } }),
    prisma.category.upsert({ where: { slug: 'fresh' }, update: { name: 'Təravətli', description: 'Gündəlik istifadə üçün təmiz və canlandırıcı qoxular' }, create: { name: 'Təravətli', slug: 'fresh', description: 'Gündəlik istifadə üçün təmiz və canlandırıcı qoxular' } }),
    prisma.category.upsert({ where: { slug: 'oud' }, update: { name: 'Ud', description: 'Qiymətli və intensiv aqarwood əsaslı lüks ətirlər' }, create: { name: 'Ud', slug: 'oud', description: 'Qiymətli və intensiv aqarwood əsaslı lüks ətirlər' } }),
    prisma.category.upsert({ where: { slug: 'citrus' }, update: { name: 'Sitrus', description: 'Sitrus notları ilə parlaq və enerjili qoxular' }, create: { name: 'Sitrus', slug: 'citrus', description: 'Sitrus notları ilə parlaq və enerjili qoxular' } }),
  ]);
  console.log('Categories created:', categories.length);

  // Brands
  const brands = await Promise.all([
    prisma.brand.upsert({ where: { slug: 'chanel' }, update: { description: 'Zamansız Fransız lüks moda və ətir evi' }, create: { name: 'Chanel', slug: 'chanel', description: 'Zamansız Fransız lüks moda və ətir evi' } }),
    prisma.brand.upsert({ where: { slug: 'dior' }, update: { description: 'Əfsanəvi Fransız yüksək moda və ətir evi' }, create: { name: 'Dior', slug: 'dior', description: 'Əfsanəvi Fransız yüksək moda və ətir evi' } }),
    prisma.brand.upsert({ where: { slug: 'tom-ford' }, update: { description: 'Cəsarətli, həssas ətirləri ilə tanınan Amerika lüks dizayneri' }, create: { name: 'Tom Ford', slug: 'tom-ford', description: 'Cəsarətli, həssas ətirləri ilə tanınan Amerika lüks dizayneri' } }),
    prisma.brand.upsert({ where: { slug: 'creed' }, update: { description: '1760-cı ildən Britaniya lüks ətir evi' }, create: { name: 'Creed', slug: 'creed', description: '1760-cı ildən Britaniya lüks ətir evi' } }),
    prisma.brand.upsert({ where: { slug: 'jo-malone' }, update: { description: 'Zərif, qat-qat ətirləri ilə tanınan Britaniya brendi' }, create: { name: 'Jo Malone', slug: 'jo-malone', description: 'Zərif, qat-qat ətirləri ilə tanınan Britaniya brendi' } }),
    prisma.brand.upsert({ where: { slug: 'byredo' }, update: { description: 'Minimalist estetika ilə İsveç müasir lüks brendi' }, create: { name: 'Byredo', slug: 'byredo', description: 'Minimalist estetika ilə İsveç müasir lüks brendi' } }),
    prisma.brand.upsert({ where: { slug: 'le-labo' }, update: { description: 'Nyorkda əl işi sənətkarlıqla hazırlanan niş ətir evi' }, create: { name: 'Le Labo', slug: 'le-labo', description: 'Nyorkda əl işi sənətkarlıqla hazırlanan niş ətir evi' } }),
    prisma.brand.upsert({ where: { slug: 'maison-margiela' }, update: { description: 'Unikal ətir hekayələri ilə avanqard Fransız moda evi' }, create: { name: 'Maison Margiela', slug: 'maison-margiela', description: 'Unikal ətir hekayələri ilə avanqard Fransız moda evi' } }),
  ]);
  console.log('Brands created:', brands.length);

  // Coupons
  await Promise.all([
    prisma.coupon.upsert({ where: { code: 'WELCOME20' }, update: { description: 'Yeni müştərilərə 20% endirim' }, create: { code: 'WELCOME20', description: 'Yeni müştərilərə 20% endirim', discountType: 'percentage', discountValue: 20, minOrderAmount: 100, maxUses: 100, expiresAt: new Date('2027-12-31') } }),
    prisma.coupon.upsert({ where: { code: 'LUXURY50' }, update: { description: '300 AZN üzəri sifarişlərdə 50 AZN endirim' }, create: { code: 'LUXURY50', description: '300 AZN üzəri sifarişlərdə 50 AZN endirim', discountType: 'fixed', discountValue: 50, minOrderAmount: 300, maxUses: 50, expiresAt: new Date('2027-12-31') } }),
    prisma.coupon.upsert({ where: { code: 'FREESHIP' }, update: { description: 'Bütün sifarişlərdə pulsuz çatdırılma' }, create: { code: 'FREESHIP', description: 'Bütün sifarişlərdə pulsuz çatdırılma', discountType: 'fixed', discountValue: 15, minOrderAmount: null, maxUses: 200, expiresAt: new Date('2027-06-30') } }),
  ]);
  console.log('Coupons created: 3');

  // Products
  const productData = [
    { name: 'Bleu de Chanel Eau de Parfum', slug: 'bleu-de-chanel-edp', description: 'Həssas bir iz buraxan aromatik odunsu ətir. Kişi zərifliyinin təcəssümü.', price: 165.00, comparePrice: 195.00, categoryId: categories[2].id, brandId: brands[0].id, topNotes: 'Qreypfrut, Limon, Nanə, Çəhrayı Bibər', middleNotes: 'Zəncəfil, Muskat, Yasəmən', baseNotes: 'Sandal ağacı, Sidr, Vetiver', longevity: '8-10 saat', usageType: 'Gündüz & Gecə', season: 'Bütün Fəsillər', stock: 50, isFeatured: true, isBestSeller: true, isTrending: true, volume: '100ml' },
    { name: 'Sauvage Elixir', slug: 'sauvage-elixir', description: 'Təzə, ədviyyatlı və odunsu notlarla zəngin və güclü ətir.', price: 185.00, comparePrice: 210.00, categoryId: categories[2].id, brandId: brands[1].id, topNotes: 'Darçın, Muskat, Qreypfrut', middleNotes: 'Lavanda, Adaçayı, Ulduz Anis', baseNotes: 'Sandal ağacı, Sidr, Vetiver, Amber', longevity: '10-12 saat', usageType: 'Gecə', season: 'Payız, Qış', stock: 35, isFeatured: true, isBestSeller: true, isTrending: true, volume: '100ml' },
    { name: 'Tom Ford Oud Wood', slug: 'tom-ford-oud-wood', description: 'Nadir ud ağacı, isti ədviyyatlar və amberin sehrli qarışımı.', price: 250.00, comparePrice: null, categoryId: categories[4].id, brandId: brands[2].id, topNotes: 'Ud, Kardamon, Çəhrayı Bibər', middleNotes: 'Sandal ağacı, Vetiver, Sidr', baseNotes: 'Amber, Tonka Lobyası, Vanil', longevity: '8-10 saat', usageType: 'Gecə', season: 'Payız, Qış', stock: 25, isFeatured: true, isBestSeller: true, volume: '50ml' },
    { name: 'Creed Aventus', slug: 'creed-aventus', description: 'Ananas, ağcaqayın və müşk ilə güc və uğuru tərənnüm edən ikonik ətir.', price: 355.00, comparePrice: 395.00, categoryId: categories[3].id, brandId: brands[3].id, topNotes: 'Ananas, Berqamot, Qara Qarağat', middleNotes: 'Ağcaqayın, Yasəmən, Qızılgül', baseNotes: 'Müşk, Palıd Mamırı, Amber, Vanil', longevity: '8-10 saat', usageType: 'Gündüz & Gecə', season: 'Yaz, Yay', stock: 20, isFeatured: true, isBestSeller: true, isTrending: true, volume: '100ml' },
    { name: 'Jo Malone Peony & Blush Suede', slug: 'jo-malone-peony-blush-suede', description: 'Payon çiçəkləri və yumşaq şaftalı dərisi ilə zərif çiçək ətiri.', price: 135.00, comparePrice: null, categoryId: categories[1].id, brandId: brands[4].id, topNotes: 'Qırmızı Alma, Zəncəfil, Berqamot', middleNotes: 'Payon, Qızılgül, Qərənfil', baseNotes: 'Süet dəri, Müşk, Amber', longevity: '4-6 saat', usageType: 'Gündüz', season: 'Yaz, Yay', stock: 40, isBestSeller: true, volume: '100ml' },
    { name: 'Byredo Gypsy Water', slug: 'byredo-gypsy-water', description: 'Berqamot, ardıc giləmeyvəsi və buxurun sehrli qarışımı.', price: 190.00, comparePrice: null, categoryId: categories[2].id, brandId: brands[5].id, topNotes: 'Berqamot, Limon, Bibər, Ardıc', middleNotes: 'Buxur, Şam iynələri, İris', baseNotes: 'Amber, Vanil, Sandal ağacı', longevity: '6-8 saat', usageType: 'Gündüz & Gecə', season: 'Bütün Fəsillər', stock: 30, isFeatured: true, isTrending: true, volume: '50ml' },
    { name: 'Le Labo Santal 33', slug: 'le-labo-santal-33', description: 'İkonik uniseks ətir. Odunsu, ədviyyatlı və dərini xatırladan notlarla unudulmaz qoxu.', price: 295.00, comparePrice: null, categoryId: categories[2].id, brandId: brands[6].id, topNotes: 'Bənövşə, Kardamon, Berqamot', middleNotes: 'Sandal ağacı, Sidr, İris', baseNotes: 'Dəri, Müşk, Amber, Vanil', longevity: '10-12 saat', usageType: 'Gündüz & Gecə', season: 'Bütün Fəsillər', stock: 15, isFeatured: true, isTrending: true, volume: '100ml' },
    { name: 'Maison Margiela Jazz Club', slug: 'maison-margiela-jazz-club', description: 'Rum, tütün yarpağı və vanil lobyasının isti, məstedici qarışımı.', price: 145.00, comparePrice: 165.00, categoryId: categories[0].id, brandId: brands[7].id, topNotes: 'Çəhrayı Bibər, Limon, Neroli', middleNotes: 'Rum, Adaçayı, Java Vetiver', baseNotes: 'Tütün Yarpağı, Vanil Lobyası, Styrax', longevity: '6-8 saat', usageType: 'Gecə', season: 'Payız, Qış', stock: 45, volume: '100ml' },
    { name: 'Chanel Coco Mademoiselle', slug: 'chanel-coco-mademoiselle', description: 'Cəsarətli və azad qadın üçün enerjili, həssas şərq ətiri.', price: 175.00, comparePrice: null, categoryId: categories[0].id, brandId: brands[0].id, topNotes: 'Portağal, Berqamot, Qreypfrut', middleNotes: 'Yasəmən, Qızılgül, Liçi', baseNotes: 'Paçuli, Vetiver, Müşk, Vanil', longevity: '8-10 saat', usageType: 'Gündüz & Gecə', season: 'Bütün Fəsillər', stock: 55, isFeatured: true, isBestSeller: true, isTrending: true, volume: '100ml' },
    { name: 'Dior J\'adore', slug: 'dior-jadore', description: 'İlanq-ilanq, qızılgül və yasəmənlə qadınlığı alqışlayan çiçək simfoniyası.', price: 155.00, comparePrice: 175.00, categoryId: categories[1].id, brandId: brands[1].id, topNotes: 'Berqamot, Armud, Qovun', middleNotes: 'Yasəmən, Qızılgül, İlanq-İlanq', baseNotes: 'Vanil, Müşk, Sidr', longevity: '6-8 saat', usageType: 'Gündüz', season: 'Yaz, Yay', stock: 60, isBestSeller: true, volume: '50ml' },
    { name: 'Tom Ford Black Orchid', slug: 'tom-ford-black-orchid', description: 'Qara orxideya, tünd şokolad və buxur ilə cəsarətli, təxribatçı ətir.', price: 220.00, comparePrice: null, categoryId: categories[0].id, brandId: brands[2].id, topNotes: 'Qara Qarağat, İlanq-İlanq, Berqamot', middleNotes: 'Qara Orxideya, Lotus, Ədviyyatlar', baseNotes: 'Buxur, Amber, Vanil, Tünd Şokolad', longevity: '10-12 saat', usageType: 'Gecə', season: 'Payız, Qış', stock: 28, isFeatured: true, volume: '50ml' },
    { name: 'Creed Silver Mountain Water', slug: 'creed-silver-mountain-water', description: 'Saf alp bulaqlarından ilhamlanan təravətli, canlandırıcı ətir.', price: 325.00, comparePrice: null, categoryId: categories[3].id, brandId: brands[3].id, topNotes: 'Berqamot, Mandarin, Qara Qarağat', middleNotes: 'Yaşıl Çay, Petitgrain', baseNotes: 'Sandal ağacı, Müşk, Galbanum', longevity: '6-8 saat', usageType: 'Gündüz', season: 'Yaz, Yay', stock: 18, volume: '100ml' },
    { name: 'Jo Malone Wood Sage & Sea Salt', slug: 'jo-malone-wood-sage-sea-salt', description: 'Dəniz duzu, adaçayı və sandal ağacı ilə sahil xəttinə səyahət.', price: 140.00, comparePrice: null, categoryId: categories[3].id, brandId: brands[4].id, topNotes: 'Berqamot, Qreypfrut', middleNotes: 'Dəniz Duzu, Adaçayı', baseNotes: 'Sandal ağacı, Sidr, İris', longevity: '4-6 saat', usageType: 'Gündüz', season: 'Yay', stock: 35, isTrending: true, volume: '100ml' },
    { name: 'Byredo Mojave Ghost', slug: 'byredo-mojave-ghost', description: 'Səhrada çiçək açan xəyali çiçəyin sehrli ətiri.', price: 200.00, comparePrice: null, categoryId: categories[1].id, brandId: brands[5].id, topNotes: 'Ambrette, Sapodilla', middleNotes: 'Maqnoliya, Bənövşə, Sandal ağacı', baseNotes: 'Sidr, Müşk, Chantilly Müşk', longevity: '6-8 saat', usageType: 'Gündüz & Gecə', season: 'Yaz, Yay', stock: 22, isTrending: true, volume: '50ml' },
    { name: 'Le Labo Another 13', slug: 'le-labo-another-13', description: 'Ambroksan, yasəmən və mamır ilə füsunkar molekulyar ətir.', price: 280.00, comparePrice: null, categoryId: categories[2].id, brandId: brands[6].id, topNotes: 'Armud, Berqamot', middleNotes: 'Yasəmən, Ambroksan', baseNotes: 'Müşk, Mamır, Sidr', longevity: '8-10 saat', usageType: 'Gündüz & Gecə', season: 'Bütün Fəsillər', stock: 12, isFeatured: true, volume: '100ml' },
  ];

  for (const p of productData) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: { name: p.name, description: p.description, price: p.price, comparePrice: p.comparePrice, topNotes: p.topNotes, middleNotes: p.middleNotes, baseNotes: p.baseNotes }, create: { ...p, price: p.price, comparePrice: p.comparePrice } });
  }
  console.log('Products created:', productData.length);

  // Reviews
  const reviewData = [
    { userId: user.id, productId: 1, rating: 5, comment: 'İnanılmaz! Bütün gün qalır.' },
    { userId: user.id, productId: 2, rating: 5, comment: 'Sahib olduğum ən yaxşı ətir.' },
    { userId: user.id, productId: 3, rating: 4, comment: 'Zəngin və sofistike. Xüsusi günlər üçün ideal.' },
    { userId: user2.id, productId: 1, rating: 5, comment: 'Bir şah əsər. Zamansız zəriflik.' },
    { userId: user2.id, productId: 9, rating: 5, comment: 'Mükəmməl qadın ətiri.' },
    { userId: user2.id, productId: 4, rating: 5, comment: 'Hər qəpiyə dəyər. İkonik.' },
  ];
  for (const r of reviewData) {
    await prisma.review.upsert({ where: { userId_productId: { userId: r.userId, productId: r.productId } }, update: { comment: r.comment, rating: r.rating }, create: r });
  }
  console.log('Reviews created:', reviewData.length);

  // Update product ratings
  const stats = await prisma.review.groupBy({ by: ['productId'], _avg: { rating: true }, _count: { rating: true } });
  for (const s of stats) {
    await prisma.product.update({ where: { id: s.productId }, data: { rating: parseFloat((s._avg.rating || 0).toFixed(2)), reviewCount: s._count.rating } });
  }
  console.log('Product ratings updated');

  // Create carts
  for (const u of [admin, user, user2]) {
    await prisma.cart.upsert({ where: { userId: u.id }, update: {}, create: { userId: u.id } });
  }
  console.log('Carts created');

  console.log('\n=== SEED COMPLETED ===');
  console.log('Admin: admin@perfumeluxury.com / admin123');
  console.log('User:  user@example.com / user123');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
