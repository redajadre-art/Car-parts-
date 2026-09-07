import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// 1. Store Settings (Global Store Info)
export const storeSettings = pgTable("store_settings", {
  id: integer("id").primaryKey().default(1),
  storeNameAr: text("store_name_ar").notNull().default("قطع غيار بلس | CarParts Pro"),
  storeNameEn: text("store_name_en").notNull().default("CarParts Pro"),
  sloganAr: text("slogan_ar").notNull().default("الوجهة الأولى لقطع غيار السيارات الأصلية والتجارية عالية الجودة"),
  sloganEn: text("slogan_en").notNull().default("Your Premium Destination for Genuine & High-Quality Auto Parts"),
  announcementBarText: text("announcement_bar_text").notNull().default("🔥 شحن مجاني للطلبات فوق 300 ريال | ضمان الفحص والتوافق 100% برقم الشاسي (VIN)"),
  announcementEnabled: boolean("announcement_enabled").notNull().default(true),
  phoneNumber: text("phone_number").notNull().default("+966 50 123 4567"),
  whatsappNumber: text("whatsapp_number").notNull().default("966501234567"),
  email: text("email").notNull().default("support@carpartspro.com"),
  address: text("address").notNull().default("الرياض - طريق الملك فهد - حي الصحافة"),
  currency: text("currency").notNull().default("ر.س"),
  logoUrl: text("logo_url").notNull().default("https://images.pexels.com/photos/34277926/pexels-photo-34277926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200"),
  footerAboutAr: text("footer_about_ar").notNull().default("متجر متخصص في توفير أفضل قطع غيار السيارات الأصلية والمعتمدة لجميع الماركات العالمية، مع خدمة فحص التوافق برقم الهيكل والتوصيل السريع لجميع مناطق المملكة والخليج."),
  taxNumber: text("tax_number").notNull().default("310123456700003"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 2. Hero Banners / Slides
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  subtitleAr: text("subtitle_ar").notNull(),
  badgeAr: text("badge_ar").default("تخفيضات موسمية تصل إلى 35%"),
  buttonTextAr: text("button_text_ar").default("تصفح القطع الآن"),
  buttonLink: text("button_link").default("/products"),
  imageUrl: text("image_url").notNull(),
  displayOrder: integer("display_order").notNull().default(1),
  isActive: boolean("is_active").notNull().default(true),
});

// 3. Product Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  descriptionAr: text("description_ar"),
  iconName: text("icon_name").notNull().default("Wrench"),
  imageUrl: text("image_url").notNull(),
  isFeatured: boolean("is_featured").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(1),
});

// 4. Products (Auto Parts)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  slug: text("slug").notNull(),
  sku: text("sku").notNull(),
  oemNumber: text("oem_number").notNull(), // رقم القطعة الاصلي
  brand: text("brand").notNull(), // الماركة المصنعة مثل Toyota, Denso, Bosch, Brembo
  condition: text("condition").notNull().default("أصلي OEM"), // أصلي / تجاري ممتاز / مجدد
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  stock: integer("stock").notNull().default(10),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.8"),
  reviewsCount: integer("reviews_count").default(12),
  descriptionAr: text("description_ar").notNull(),
  specifications: text("specifications"), // JSON object string: e.g. {"ضمان": "12 شهر", "بلد الصنع": "اليابان"}
  images: text("images").notNull(), // JSON array of image URLs
  isFeatured: boolean("is_featured").notNull().default(false),
  isBestSeller: boolean("is_best_seller").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// 5. Vehicles Database (for Vehicle Selector Tool)
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(), // تويوتا, نيسان, فورد, هيونداي, بي إم دبليو, مرسيدس, هواندا, جي إم سي
  model: text("model").notNull(), // كامري, لاندكروزر, باترول, موستانج, النترا, الفئة الخامسة
  yearStart: integer("year_start").notNull(),
  yearEnd: integer("year_end").notNull(),
  engine: text("engine").notNull(), // e.g. 2.5L 4-Cyl, 3.5L V6, 5.7L V8
});

// 6. Product Fitments (Maps products to vehicles)
export const productFitments = pgTable("product_fitments", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  vehicleId: integer("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  notes: text("notes"), // ملاحظات التوافق e.g. أمامي فقط / جير أوتوماتيك
});

// 7. Promotional Banners (Section Banners)
export const promotionalBanners = pgTable("promotional_banners", {
  id: serial("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  subtitleAr: text("subtitle_ar").notNull(),
  discountTag: text("discount_tag").default("خصم حصري"),
  buttonText: text("button_text").default("تسوق العرض"),
  buttonLink: text("button_link").default("/products"),
  imageUrl: text("image_url").notNull(),
  bgGradient: text("bg_gradient").default("from-red-600 to-amber-600"),
  isActive: boolean("is_active").notNull().default(true),
});

// 8. Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  shippingAddress: text("shipping_address").notNull(),
  city: text("city").notNull(),
  vehicleInfo: text("vehicle_info"), // السيارة المختارة وقت الطلب
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("جديد"), // جديد, قيد المعالجة, تم الشحن, تم التسليم, ملغي
  paymentMethod: text("payment_method").notNull().default("الدفع عند الاستلام"),
  paymentStatus: text("payment_status").notNull().default("في الانتظار"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 9. Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  productTitle: text("product_title").notNull(),
  oemNumber: text("oem_number").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
});

// 10. Coupons
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull().default("percentage"), // percentage or fixed
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 }).default("0"),
  isActive: boolean("is_active").notNull().default(true),
});

// 11. Customer Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull().default(5),
  comment: text("comment").notNull(),
  vehicleModel: text("vehicle_model"),
  isApproved: boolean("is_approved").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// 12. Custom Editable Sections (Dynamic Content Blocks on Homepage & About)
export const customSections = pgTable("custom_sections", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(), // e.g. "why_choose_us", "guarantee_bar", "mechanic_adviser"
  titleAr: text("title_ar").notNull(),
  subtitleAr: text("subtitle_ar").notNull(),
  contentJson: text("content_json").notNull(), // JSON string representing list of features / blocks
  isActive: boolean("is_active").notNull().default(true),
});
