import { db } from "./index";
import {
  storeSettings,
  heroSlides,
  categories,
  products,
  vehicles,
  productFitments,
  promotionalBanners,
  orders,
  orderItems,
  coupons,
  reviews,
  customSections,
} from "./schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if storeSettings exists
    const existingSettings = await db.select().from(storeSettings).limit(1);
    if (existingSettings.length > 0) {
      console.log("Database already seeded.");
      return;
    }

    console.log("Seeding database with rich auto parts store data...");

    // 1. Store Settings
    await db.insert(storeSettings).values({
      id: 1,
      storeNameAr: "قطع غيار بلس | CarParts Pro",
      storeNameEn: "CarParts Pro",
      sloganAr: "المتجر المتخصص الأكبر لقطع غيار السيارات الأصلية مع فحص رقم الهيكل VIN",
      sloganEn: "The Premier Auto Parts Marketplace with VIN Verification",
      announcementBarText: "⚡ عرض خاص: خصم 15% على فلاتر وزيوت المحركات مع كود [CAR15] + شحن مجاني للطلبات فوق 300 ريال",
      announcementEnabled: true,
      phoneNumber: "+966 55 987 6543",
      whatsappNumber: "966559876543",
      email: "sales@carpartspro.com",
      address: "الرياض - حي الصحافة - طريق الملك فهد ، المملكة العربية السعودية",
      currency: "ر.س",
      logoUrl: "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
      footerAboutAr: "متجر قطع غيار بلس هو منصتك الاحترافية المعتمدة لطلب كافة قطع غيار السيارات الأصلية والتجارية الدرجة الأولى مع ضمان الفحص الكامل والمطابقة 100% برقم الهيكل الشاسي.",
      taxNumber: "310123456700003",
    });

    // 2. Hero Slides
    await db.insert(heroSlides).values([
      {
        titleAr: "قطع غيار أصلية 100% لجميع أنواع السيارات",
        titleEn: "100% Genuine Auto Parts for All Vehicles",
        subtitleAr: "ابحث برقم القطعة (OEM) أو اختر نوع سيارتك وسنتك لتجد القطعة المناسبة بدقة متناهية وبأفضل الأسعار.",
        badgeAr: "ضمان الفحص والتوافق 100%",
        buttonTextAr: "تصفح الكتالوج الآن",
        buttonLink: "/products",
        imageUrl: "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        displayOrder: 1,
        isActive: true,
      },
      {
        titleAr: "أنظمة المكابح والفرامل عالية الأداء",
        titleEn: "High Performance Braking Systems",
        subtitleAr: "أقراص فرامل وقماشات سيراميك وأصلي من بريمبو، تويوتا، ودينسو لأعلى مستويات الأمان والتحكم.",
        badgeAr: "تخفيضات تصل إلى 25%",
        buttonTextAr: "تسوق قطع الفرامل",
        buttonLink: "/products?category=brakes",
        imageUrl: "https://images.pexels.com/photos/833320/pexels-photo-833320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        displayOrder: 2,
        isActive: true,
      },
      {
        titleAr: "زيوت وفلاتر المحركات المعتمدة عالمياً",
        titleEn: "Certified Engine Oils & Filters",
        subtitleAr: "موبيل 1، شيل، كاسترول، وفلاتر تويوتا ونيسان الأصلية لحماية محرك سيارتك وزيادة عمره الافتراضي.",
        badgeAr: "عروض الحزم الاقتصادية",
        buttonTextAr: "عرض حزم الزيوت",
        buttonLink: "/products?category=oils-filters",
        imageUrl: "https://images.pexels.com/photos/4294075/pexels-photo-4294075.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
        displayOrder: 3,
        isActive: true,
      },
    ]);

    // 3. Categories
    const insertedCats = await db.insert(categories).values([
      {
        slug: "brakes",
        nameAr: "أنظمة الفرامل والمكابح",
        nameEn: "Brake Systems",
        descriptionAr: "أقراص الفرامل (الهوبات)، فحمات سيراميك، هيدروليك وسوائل الفرامل",
        iconName: "Disc",
        imageUrl: "https://images.pexels.com/photos/833320/pexels-photo-833320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
        isFeatured: true,
        displayOrder: 1,
      },
      {
        slug: "engine",
        nameAr: "قطع المحرك وناقل الحركة",
        nameEn: "Engine & Drivetrain",
        descriptionAr: "شمعات الاحتراق (البواجي)، السيور، البساتم، مضخات الماء والوقود",
        iconName: "Cpu",
        imageUrl: "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
        isFeatured: true,
        displayOrder: 2,
      },
      {
        slug: "oils-filters",
        nameAr: "الزيوت والفلاتر",
        nameEn: "Oils & Filters",
        descriptionAr: "زيوت المحركات، فلاتر الزيت، فلاتر الهواء، فلاتر المكيف، زيوت القير",
        iconName: "Droplets",
        imageUrl: "https://images.pexels.com/photos/4294075/pexels-photo-4294075.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
        isFeatured: true,
        displayOrder: 3,
      },
      {
        slug: "suspension",
        nameAr: "نظام التعليق والمساعدات",
        nameEn: "Suspension & Steering",
        descriptionAr: "المساعدات، اليايات، المقصات، جوزات الدريكسون، كرسي المحرك",
        iconName: "Shield",
        imageUrl: "https://images.pexels.com/photos/34277923/pexels-photo-34277923.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
        isFeatured: true,
        displayOrder: 4,
      },
      {
        slug: "electrical-lighting",
        nameAr: "الكهرباء والإضاءة",
        nameEn: "Electrical & Lighting",
        descriptionAr: "الشمعات الأمامية LED، اللمبات، الدينامو، السلف، البطاريات، الحساسات",
        iconName: "Zap",
        imageUrl: "https://images.pexels.com/photos/6870307/pexels-photo-6870307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
        isFeatured: true,
        displayOrder: 5,
      },
      {
        slug: "cooling-exhaust",
        nameAr: "التبريد والعادم",
        nameEn: "Cooling & Exhaust",
        descriptionAr: "الرديترات، طرمبات الماء، مراوح التبريد، الشكمان، حساسات الشكمان",
        iconName: "Wind",
        imageUrl: "https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
        isFeatured: true,
        displayOrder: 6,
      },
    ]).returning();

    const catBrakes = insertedCats.find(c => c.slug === "brakes")?.id || 1;
    const catEngine = insertedCats.find(c => c.slug === "engine")?.id || 2;
    const catOils = insertedCats.find(c => c.slug === "oils-filters")?.id || 3;
    const catSuspension = insertedCats.find(c => c.slug === "suspension")?.id || 4;
    const catElec = insertedCats.find(c => c.slug === "electrical-lighting")?.id || 5;

    // 4. Vehicles Database
    const insertedVehicles = await db.insert(vehicles).values([
      { make: "تويوتا", model: "كامري", yearStart: 2018, yearEnd: 2024, engine: "2.5L 4-Cyl" },
      { make: "تويوتا", model: "لاندكروزر", yearStart: 2016, yearEnd: 2023, engine: "5.7L V8" },
      { make: "نيسان", model: "باترول", yearStart: 2015, yearEnd: 2024, engine: "5.6L V8" },
      { make: "نيسان", model: "التيما", yearStart: 2019, yearEnd: 2024, engine: "2.5L 4-Cyl" },
      { make: "فورد", model: "موستانج", yearStart: 2018, yearEnd: 2023, engine: "5.0L V8 GT" },
      { make: "فورد", model: "اف-150", yearStart: 2017, yearEnd: 2023, engine: "3.5L EcoBoost V6" },
      { make: "هيونداي", model: "النترا", yearStart: 2019, yearEnd: 2024, engine: "2.0L 4-Cyl" },
      { make: "هيونداي", model: "سوناتا", yearStart: 2020, yearEnd: 2024, engine: "2.5L 4-Cyl" },
      { make: "بي إم دبليو", model: "الفئة الخامسة 530i", yearStart: 2017, yearEnd: 2023, engine: "2.0L Turbo Inline-4" },
      { make: "مرسيدس-بنز", model: "C-Class C200", yearStart: 2018, yearEnd: 2024, engine: "2.0L Turbo" },
    ]).returning();

    // 5. Products List
    const insertedProds = await db.insert(products).values([
      {
        titleAr: "طقم فحمات فرامل سيراميك أمامي تويوتا كامري أصلي",
        titleEn: "Toyota Camry Genuine Front Ceramic Brake Pads",
        slug: "toyota-camry-brake-pads-front",
        sku: "BRK-TOY-04465-33470",
        oemNumber: "04465-33470",
        brand: "تويوتا أصلي OEM",
        condition: "أصلي OEM",
        categoryId: catBrakes,
        price: "245.00",
        salePrice: "195.00",
        stock: 35,
        rating: "4.9",
        reviewsCount: 28,
        descriptionAr: "طقم قماشات/فحمات فرامل أمامية سيراميك عالية الجودة أصلية وكالة لتويوتا كامري. يوفر قدرة كبح ممتازة وبدون أفيز أو صرير، مع استجابة فورية وحماية لهوبات الفرامل.",
        specifications: JSON.stringify({
          "رقم OEM": "04465-33470",
          "المادة": "سيراميك مقوى مقاوم للحرارة العالية",
          "الموقع": "أمامي (يمين + يسار)",
          "الضمان": "12 شهر أو 20,000 كم",
          "بلد الصنع": "اليابان"
        }),
        images: JSON.stringify([
          "https://images.pexels.com/photos/833320/pexels-photo-833320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800",
          "https://images.pexels.com/photos/34277923/pexels-photo-34277923.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
        ]),
        isFeatured: true,
        isBestSeller: true,
      },
      {
        titleAr: "هوب فرامل أصلي مخرم ومبرد بريمبو Brembo High Performance",
        titleEn: "Brembo Drilled Performance Front Brake Disc",
        slug: "brembo-drilled-front-brake-disc",
        sku: "BRK-BRM-09A92411",
        oemNumber: "43512-06150",
        brand: "Brembo",
        condition: "درجة أولى الممتاز",
        categoryId: catBrakes,
        price: "420.00",
        salePrice: "380.00",
        stock: 18,
        rating: "4.95",
        reviewsCount: 19,
        descriptionAr: "هوبات فرامل رياضية مخرمة ومبردة من شركة Brembo الإيطالية العالمية. تعطي تبريداً سريعاً وتتخلص من الحرارة والغازات أثناء الفرملة القوية لمستوى أمان مطلق.",
        specifications: JSON.stringify({
          "قطر الهوب": "305 مم",
          "السمك": "28 مم",
          "النوع": "مخرم ومبرد رياضياً",
          "الضمان": "24 شهر ضد التشوه والاهتزاز",
          "بلد الصنع": "إيطاليا"
        }),
        images: JSON.stringify([
          "https://images.pexels.com/photos/34277923/pexels-photo-34277923.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800",
          "https://images.pexels.com/photos/833320/pexels-photo-833320.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
        ]),
        isFeatured: true,
        isBestSeller: true,
      },
      {
        titleAr: "طقم شمعات احتراق ليزر إيريديوم دنسو DENSO Iridium Power (4 بواجي)",
        titleEn: "Denso Iridium Power Spark Plugs Set of 4",
        slug: "denso-iridium-spark-plugs-set-4",
        sku: "ENG-DEN-90919-02258",
        oemNumber: "90919-02258",
        brand: "Denso",
        condition: "أصلي OEM",
        categoryId: catEngine,
        price: "180.00",
        salePrice: "145.00",
        stock: 50,
        rating: "4.88",
        reviewsCount: 42,
        descriptionAr: "طقم بواجي إيريديوم ليزر أصلي من Denso اليابانية. يحسن تسارع السيارة، يقلل استهلاك الوقود، ويوفر شرارة اشتعال قوية وثابتة حتى في أصعب الظروف.",
        specifications: JSON.stringify({
          "نوع رأس الشمعة": "إيريديوم ليزر 0.4 مم",
          "العمر الافتراضي": "Up to 100,000 كم",
          "الكمية": "4 بواجي في العلبة",
          "الضمان": "سنة كاملة",
          "بلد الصنع": "اليابان"
        }),
        images: JSON.stringify([
          "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
        ]),
        isFeatured: true,
        isBestSeller: true,
      },
      {
        titleAr: "زيت محرك تخليقي بالكامل موبيل 1 سيتي Mobil 1 5W-30 (كرتون 4 لتر)",
        titleEn: "Mobil 1 Advanced Full Synthetic Motor Oil 5W-30 4L",
        slug: "mobil-1-full-synthetic-oil-5w30-4l",
        sku: "OIL-MOB-5W30-4L",
        oemNumber: "071924149762",
        brand: "Mobil 1",
        condition: "أصلي OEM",
        categoryId: catOils,
        price: "165.00",
        salePrice: "135.00",
        stock: 80,
        rating: "4.92",
        reviewsCount: 65,
        descriptionAr: "زيت المحرك التخليقي الكامل الأعلى تقييماً من موبيل 1 لتقليل الاحتكاك وحماية المحرك من الرواسب والتآكل حتى 10,000 كم، ملائم لطقس الخليج الشديد.",
        specifications: JSON.stringify({
          "الدرجة": "5W-30 Full Synthetic",
          "الحجم": "4 لتر",
          "المواصفات": "API SP / ILSAC GF-6A",
          "المسافة القطعية": "10,000 كم",
          "التطبيق": "محركات البنزين والهايبرد"
        }),
        images: JSON.stringify([
          "https://images.pexels.com/photos/4294075/pexels-photo-4294075.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
        ]),
        isFeatured: true,
        isBestSeller: true,
      },
      {
        titleAr: "فلتر زيت محرك أصلي تويوتا Genuine Toyota Oil Filter",
        titleEn: "Toyota Genuine Engine Oil Filter Element",
        slug: "toyota-genuine-oil-filter-90915-yzzzd2",
        sku: "FLT-TOY-90915-YZZD2",
        oemNumber: "90915-YZZD2",
        brand: "تويوتا أصلي OEM",
        condition: "أصلي OEM",
        categoryId: catOils,
        price: "35.00",
        salePrice: "28.00",
        stock: 120,
        rating: "4.90",
        reviewsCount: 88,
        descriptionAr: "فلتر زيت المحرك الأصلي المعتمد من وكالة تويوتا. يحتجز الشوائب والدقائق الدقيقة كفاءة 99% مع صمام منع الارتجاع لحماية المحرك فور التشغيل.",
        specifications: JSON.stringify({
          "رقم OEM": "90915-YZZD2",
          "النوع": "فلتر زيت محرك حديد",
          "التوافق": "كامري، كورولا، راف 4، هيلوكس",
          "بلد الصنع": "اليابان / تايلاند أصلية"
        }),
        images: JSON.stringify([
          "https://images.pexels.com/photos/4294075/pexels-photo-4294075.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
        ]),
        isFeatured: false,
        isBestSeller: true,
      },
      {
        titleAr: "طقم مساعدات غاز خلفية KYB Excel-G لكامري وسوناتا",
        titleEn: "KYB Excel-G Rear Gas Shock Absorbers Pair",
        slug: "kyb-excel-g-rear-shock-absorbers-pair",
        sku: "SUS-KYB-341368",
        oemNumber: "48530-06320",
        brand: "KYB",
        condition: "أصلي OEM",
        categoryId: catSuspension,
        price: "490.00",
        salePrice: "430.00",
        stock: 14,
        rating: "4.85",
        reviewsCount: 15,
        descriptionAr: "طقم مساعدات خلفية غاز وزيت من KYB اليابانية الشهيرة. يعيد إلى سيارتك ثبات الوكالة وامتصاص الصدمات والاهتزازات على الطرق الوعرة والسرعات العالية.",
        specifications: JSON.stringify({
          "التصميم": "Gas Strut Dual Tube",
          "الموقع": "خلفي (يمين + يسار)",
          "الضمان": "12 شهر أستبدال فوراً",
          "بلد الصنع": "اليابان"
        }),
        images: JSON.stringify([
          "https://images.pexels.com/photos/34277923/pexels-photo-34277923.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
        ]),
        isFeatured: true,
        isBestSeller: false,
      },
      {
        titleAr: "شمعة إضاءة LED أمامية فائقة السطوع 16000 لومن (طقم لمبتين)",
        titleEn: "Ultra Bright LED Headlight Bulbs Kit 16000LM",
        slug: "ultra-bright-led-headlight-bulbs-h11-h7",
        sku: "ELC-LED-H11-16000",
        oemNumber: "81110-06C40",
        brand: "Philips Lumileds",
        condition: "درجة أولى الممتاز",
        categoryId: catElec,
        price: "290.00",
        salePrice: "220.00",
        stock: 22,
        rating: "4.89",
        reviewsCount: 31,
        descriptionAr: "طقم لمبات LED للأنوار الأمامية برؤية كريستالية ناصعة 6000K، مع مروحة توربو للتبريد ولا يسبب خطأ في الكمبيوتر Canbus. سهولة التركيب بدون تقطيع أسلاك.",
        specifications: JSON.stringify({
          "السطوع": "16000 Lumens Pair",
          "لون الإضاءة": "6000K الأبيض النقي",
          "عمر التشغيل": "50,000 ساعة",
          "المقاومة": "IP68 ضد الماء والغبار",
          "الضمان": "24 شهر"
        }),
        images: JSON.stringify([
          "https://images.pexels.com/photos/6870307/pexels-photo-6870307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
        ]),
        isFeatured: true,
        isBestSeller: false,
      },
      {
        titleAr: "سير محرك دينامو ومكيف Bando Ribbed V-Belt",
        titleEn: "Bando Heavy Duty Serpentine Fan Belt",
        slug: "bando-heavy-duty-serpentine-fan-belt-6pk1230",
        sku: "ENG-BND-6PK1230",
        oemNumber: "90916-02711",
        brand: "Bando",
        condition: "أصلي OEM",
        categoryId: catEngine,
        price: "85.00",
        salePrice: "68.00",
        stock: 40,
        rating: "4.78",
        reviewsCount: 11,
        descriptionAr: "سير محرك أصلي مطاطي مقوى بألياف الايبوكسي من Bando اليابان. يتحمل الحرارة العالية ويمنع الانزلاق والاصوات عند تشغيل التكييف.",
        specifications: JSON.stringify({
          "الرقم": "6PK1230",
          "المادة": "EPDM Rubber reinforced",
          "الضمان": "12 شهر",
          "بلد الصنع": "اليابان"
        }),
        images: JSON.stringify([
          "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800"
        ]),
        isFeatured: false,
        isBestSeller: false,
      },
    ]).returning();

    // 6. Product Fitments linking
    if (insertedVehicles.length > 0 && insertedProds.length > 0) {
      await db.insert(productFitments).values([
        { productId: insertedProds[0].id, vehicleId: insertedVehicles[0].id, notes: "أمامي - يطابق جميع فئات الكامري 2.5L" },
        { productId: insertedProds[1].id, vehicleId: insertedVehicles[0].id, notes: "هوب رياضية أمامية" },
        { productId: insertedProds[2].id, vehicleId: insertedVehicles[0].id, notes: "محرك 4 سلندر 2.5L" },
        { productId: insertedProds[3].id, vehicleId: insertedVehicles[0].id, notes: "جميع محركات البنزين والهايبرد" },
        { productId: insertedProds[4].id, vehicleId: insertedVehicles[0].id, notes: "فلتر الزيت الأصلي" },
        { productId: insertedProds[5].id, vehicleId: insertedVehicles[0].id, notes: "مساعدات غاز خلفية طقم" },
        { productId: insertedProds[0].id, vehicleId: insertedVehicles[7].id, notes: "تطابق قماشات هيونداي سوناتا 2.5L" },
      ]);
    }

    // 7. Promotional Banners
    await db.insert(promotionalBanners).values([
      {
        titleAr: "حزمة صيانة دورية المحرك المتميزة",
        subtitleAr: "اشترِ 4 لتر زيت تخليقي + فلتر زيت أصلي + 4 بواجي إيريديوم واحصل على خصم 20% فوراً",
        discountTag: "وفر 20% الآن",
        buttonText: "تصفح الحزمة",
        buttonLink: "/products?category=oils-filters",
        imageUrl: "https://images.pexels.com/photos/4294075/pexels-photo-4294075.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=900",
        bgGradient: "from-amber-600 to-red-700",
        isActive: true,
      },
      {
        titleAr: "تحديث الإضاءة والأمان ليلاً",
        subtitleAr: "شمعات LED برؤية ثلاثية الأبعاد بخصومات حصرية وشحن سريع لجميع مدن المملكة",
        discountTag: "إضاءة LED 16000LM",
        buttonText: "تسوق الإضاءة",
        buttonLink: "/products?category=electrical-lighting",
        imageUrl: "https://images.pexels.com/photos/6870307/pexels-photo-6870307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=900",
        bgGradient: "from-slate-800 to-indigo-950",
        isActive: true,
      },
    ]);

    // 8. Coupons
    await db.insert(coupons).values([
      { code: "CAR15", discountType: "percentage", discountValue: "15.00", minOrderAmount: "150.00", isActive: true },
      { code: "PRO50", discountType: "fixed", discountValue: "50.00", minOrderAmount: "300.00", isActive: true },
      { code: "FREEVIP", discountType: "percentage", discountValue: "10.00", minOrderAmount: "0.00", isActive: true },
    ]);

    // 9. Orders & Order Items
    const sampleOrders = await db.insert(orders).values([
      {
        orderNumber: "CP-10291",
        customerName: "فهد العتيبي",
        customerPhone: "0501234567",
        customerEmail: "fahad@example.com",
        shippingAddress: "حي النفل - الشارع الرئيسي - فيلا 12",
        city: "الرياض",
        vehicleInfo: "تويوتا كامري 2021 (2.5L)",
        totalAmount: "330.00",
        status: "تم الشحن",
        paymentMethod: "بطاقة ائتمانية / مدى",
        paymentStatus: "مدفوع",
        notes: "يرجى الاتصال قبل التوصيل",
      },
      {
        orderNumber: "CP-10292",
        customerName: "عبدالله الشمري",
        customerPhone: "0559876543",
        customerEmail: "abdullah@example.com",
        shippingAddress: "حي الفيصلية - شارع الستين",
        city: "جدة",
        vehicleInfo: "نيسان باترول 2020 (5.6L V8)",
        totalAmount: "420.00",
        status: "قيد المعالجة",
        paymentMethod: "الدفع عند الاستلام",
        paymentStatus: "في الانتظار",
        notes: "تأكيد فحص رقم الهيكل",
      },
      {
        orderNumber: "CP-10293",
        customerName: "سارة القحطاني",
        customerPhone: "0543219876",
        customerEmail: "sara@example.com",
        shippingAddress: "حي المبرز - طريق المطار",
        city: "الدمام",
        vehicleInfo: "هيونداي النترا 2022",
        totalAmount: "180.00",
        status: "جديد",
        paymentMethod: "الدفع عند الاستلام",
        paymentStatus: "في الانتظار",
        notes: "",
      },
    ]).returning();

    if (sampleOrders.length > 0 && insertedProds.length > 0) {
      await db.insert(orderItems).values([
        {
          orderId: sampleOrders[0].id,
          productId: insertedProds[0].id,
          productTitle: insertedProds[0].titleAr,
          oemNumber: insertedProds[0].oemNumber,
          price: "195.00",
          quantity: 1,
        },
        {
          orderId: sampleOrders[0].id,
          productId: insertedProds[3].id,
          productTitle: insertedProds[3].titleAr,
          oemNumber: insertedProds[3].oemNumber,
          price: "135.00",
          quantity: 1,
        },
        {
          orderId: sampleOrders[1].id,
          productId: insertedProds[1].id,
          productTitle: insertedProds[1].titleAr,
          oemNumber: insertedProds[1].oemNumber,
          price: "380.00",
          quantity: 1,
        },
      ]);
    }

    // 10. Reviews
    if (insertedProds.length > 0) {
      await db.insert(reviews).values([
        {
          productId: insertedProds[0].id,
          customerName: "سعود الحربي",
          rating: 5,
          comment: "قماشات ممتازة جداً وبدون أي صوت صرير، ركبتها على كامري 2020 وفرق معايا الفرامل بشكل ملحوظ. شكر متجر قطع غيار بلس على السرعة والتطابق برقم الشاسي!",
          vehicleModel: "تويوتا كامري 2020",
          isApproved: true,
        },
        {
          productId: insertedProds[0].id,
          customerName: "محمد الشهري",
          rating: 5,
          comment: "قطعة أصلية وكالة وبسعر أرخص من الموزعين المحليين. الشحن أخذ يومين فقط للدمام.",
          vehicleModel: "تويوتا كامري 2022",
          isApproved: true,
        },
        {
          productId: insertedProds[2].id,
          customerName: "خالد المطيري",
          rating: 5,
          comment: "بواجي دنشو الإيريديوم أصلية 100%. أداء المحرك أصبح أنعم وصرفية البنزين تحسنت.",
          vehicleModel: "هيونداي سوناتا 2021",
          isApproved: true,
        },
      ]);
    }

    // 11. Custom Sections (Allows Editing "لماذا نحن", "ضمان الفحص", "الأسئلة الشائعة")
    await db.insert(customSections).values([
      {
        sectionKey: "why_choose_us",
        titleAr: "لماذا يثق بنا آلاف أصحاب السيارات والمركبات؟",
        subtitleAr: "نوفر لك تجربة تسوق قطع غيار السيارات السلسة والأكثر أماناً والموثوقة بالكامل",
        contentJson: JSON.stringify([
          {
            icon: "ShieldCheck",
            title: "مطابقة 100% برقم الشاسي (VIN)",
            desc: "فريقنا الفني يفحص رقم هيكل سيارتك قبل تجهيز الشحنة لضمان وصول القطعة المتوافقة تماماً."
          },
          {
            icon: "Truck",
            title: "شحن سريع لجميع المدن والخليج",
            desc: "توصيل خلال 24-48 ساعة داخل المملكة وبوابات شحن آمنة وموثوقة كلياً."
          },
          {
            icon: "BadgeCheck",
            title: "قطع غيار أصلية ومضمونة",
            desc: "نضمن مصدر كافة قطع الغيار بعقود استيراد مباشرة من المصنعين المعتمدين وبضمان رسمي."
          },
          {
            icon: "Headphones",
            title: "دعم فني واستشارة ميكانيكية",
            desc: "خبراء ميكانيكا متاحون على مدار الساعة عبر الواتساب لمساعدتك في اختيار القطعة الصحيحة."
          }
        ]),
        isActive: true,
      },
      {
        sectionKey: "mechanic_tip",
        titleAr: "نصيحة المهندس الميكانيكي لليوم",
        subtitleAr: "تغيير فلاتر وزيوت المحرك في مواعيدها يرفع عمر المحرك الافتراضي بنسبة 40%",
        contentJson: JSON.stringify({
          tipTitle: "كيف تعتني بنظام المكابح قبل فصل الصيف؟",
          tipContent: "تأكد دائماً من سمك فحمات الفرامل وجودة زيت الفرامل DOT4 لضمان عدم تبخر السائل أثناء درجات الحرارة العالية. استخدم فحمات السيراميك المعالجة لتجنب الضوضاء والاهتزاز.",
          buttonText: "اكتشف قطع الصيانة الصيفية",
          buttonLink: "/products?category=brakes"
        }),
        isActive: true,
      }
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
