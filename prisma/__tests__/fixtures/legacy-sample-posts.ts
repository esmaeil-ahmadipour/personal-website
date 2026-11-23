// prisma/__tests__/fixtures/legacy-sample-posts.ts
//
// Untouched reference copy of the sample posts that the original prisma/seed.ts
// created. Not used at runtime: it is the conversion reference for moving these
// posts to file-managed Markdown content. Original indentation is kept on
// purpose because the HTML lives inside template literals.

import { PostStatus } from "@prisma/client";

export const legacyPosts = [
    {
      slug: "introducing-tarvix-engineering-system",

      // فیلدهای متا
      isFeatured: true,
      isTrending: true,
      isPinned: false,
      priority: 1,
      language: "en",

      // انگلیسی
      titleEn: "Introducing the Tarvix Engineering System",
      excerptEn:
        "A codified engineering system for Flutter, Web, and Web3. Built to resolve active constraints across high-stakes domains.",
      contentEn: `
        <h2>What is the Tarvix Engineering System?</h2>
        <p>The Tarvix Engineering System is a codified set of architectural decisions, quality standards, and automation patterns. It represents what we learned solving complex problems across fintech, Web3, logistics, and ed-tech.</p>
        
        <h3>Key Principles</h3>
        <ul>
          <li><strong>Modular Domain Boundaries</strong> — Feature-first organization with clean separation between domain logic, data access, and presentation.</li>
          <li><strong>Living Documentation</strong> — Architectural Decision Records (ADRs) as first-class citizens.</li>
          <li><strong>Automated Quality Gates</strong> — CI that enforces architecture rules before merge.</li>
          <li><strong>Reference Implementations</strong> — Applied examples that clarify architectural decisions.</li>
        </ul>
        
        <h3>Why This Matters</h3>
        <p>When architecture decisions are documented and enforced, teams stop debating the same questions. When quality is automated, human energy goes to product value, not firefighting.</p>
        
        <p>The platform gives you visibility into how we build. The system provides patterns you can adapt. A shared foundation grounded in engineering reality.</p>
      `,
      seoTitleEn: "Tarvix Engineering System - Production-Ready Patterns",
      seoDescriptionEn:
        "Discover the Tarvix Engineering System: codified architectural decisions, quality standards, and automation patterns for Flutter, Web, and Web3.",
      keywordsEn: "engineering system, architecture, flutter, web3, quality automation",
      ogImageEn: "/images/og/tarvix-engineering-system.jpg",

      // فارسی
      titleFa: "معرفی سیستم مهندسی Tarvix",
      excerptFa:
        "یک سیستم مهندسی مدون برای فلاتر، وب و وب۳. ساخته شده برای حل چالش‌های پیش رو در حوزه‌های پرریسک.",
      contentFa: `
        <h2>سیستم مهندسی Tarvix چیست؟</h2>
        <p>سیستم مهندسی Tarvix مجموعه‌ای مدون از تصمیمات معماری، استانداردهای کیفیت و الگوهای اتوماسیون است. این سیستم نشان‌دهنده آنچه ما در حل مشکلات پیچیده در حوزه‌های فین‌تک، Web3، لجستیک و اد-تک یاد گرفتیم، می‌باشد.</p>
        
        <h3>اصول کلیدی</h3>
        <ul>
          <li><strong>مرزهای دامنه ماژولار</strong> — سازمان‌دهی مبتنی بر ویژگی با جداسازی تمیز بین منطق دامنه، دسترسی به داده و ارائه.</li>
          <li><strong>مستندات زنده</strong> — سوابق تصمیمات معماری (ADR) به عنوان شهروندان درجه یک.</li>
          <li><strong>دروازه‌های کیفیت خودکار</strong> — یکپارچه‌سازی مداوم که قوانین معماری را قبل از ادغام اعمال می‌کند.</li>
          <li><strong>پیاده‌سازی‌های مرجع</strong> — مثال‌های کاربردی که تصمیمات معماری را روشن می‌کنند.</li>
        </ul>
        
        <h3>چرا این مهم است</h3>
        <p>وقتی تصمیمات معماری مستند و اعمال می‌شوند، تیم‌ها از بحث درباره سوالات تکراری دست می‌کشند. وقتی کیفیت خودکار می‌شود، انرژی انسانی به ارزش محصول می‌رود، نه به آتش‌نشانی.</p>
        
        <p>این پلتفرم به شما دیدگاهی از نحوه ساخت ما می‌دهد. سیستم الگوهایی را ارائه می‌دهد که می‌توانید تطبیق دهید. یک بنیاد مشترک مبتنی بر واقعیت مهندسی.</p>
      `,
      seoTitleFa: "سیستم مهندسی Tarvix - الگوهای آماده تولید",
      seoDescriptionFa:
        "سیستم مهندسی Tarvix را کشف کنید: تصمیمات معماری مدون، استانداردهای کیفیت و الگوهای اتوماسیون برای فلاتر، وب و وب۳.",
      keywordsFa: "سیستم مهندسی، معماری، فلاتر، وب۳، اتوماسیون کیفیت",
      ogImageFa: "/images/og/tarvix-engineering-system-fa.jpg",

      // عربی
      titleAr: "تقديم نظام Tarvix الهندسي",
      excerptAr:
        "نظام هندسي مدون لـ Flutter و Web و Web3. تم بناؤه لحل القيود النشطة عبر المجالات عالية المخاطر.",
      contentAr: `
        <h2>ما هو نظام Tarvix الهندسي؟</h2>
        <p>نظام Tarvix الهندسي هو مجموعة مدونة من القرارات المعمارية ومعايير الجودة وأنماط الأتمتة. يمثل ما تعلمناه من حل المشكلات المعقدة في مجالات التكنولوجيا المالية و Web3 والخدمات اللوجستية والتعليم التقني.</p>
        
        <h3>المبادئ الرئيسية</h3>
        <ul>
          <li><strong>حدود المجال المعيارية</strong> — تنظيم قائم على الميزات مع فصل نظيف بين منطق المجال والوصول إلى البيانات والعرض.</li>
          <li><strong>التوثيق الحي</strong> — سجلات القرارات المعمارية (ADRs) كمواطنين من الدرجة الأولى.</li>
          <li><strong>بوابات الجودة الآلية</strong> — التكامل المستمر الذي يفرض قواعد الهندسة المعمارية قبل الدمج.</li>
          <li><strong>التطبيقات المرجعية</strong> — أمثلة تطبيقية توضح القرارات المعمارية.</li>
        </ul>
        
        <h3>لماذا هذا مهم</h3>
        <p>عندما يتم توثيق وتطبيق القرارات المعمارية، تتوقف الفرق عن مناقشة نفس الأسئلة. عندما تكون الجودة آلية، تذهب الطاقة البشرية إلى قيمة المنتج، وليس إلى مكافحة الحرائق.</p>
        
        <p>تمنحك المنصة رؤية لكيفية بنائنا. يوفر النظام أنماطًا يمكنك تكييفها. أساس مشترك مبني على الواقع الهندسي.</p>
      `,
      seoTitleAr: "نظام Tarvix الهندسي - أنماط جاهزة للإنتاج",
      seoDescriptionAr:
        "اكتشف نظام Tarvix الهندسي: القرارات المعمارية المدونة ومعايير الجودة وأنماط الأتمتة لـ Flutter و Web و Web3.",
      keywordsAr: "نظام هندسي، معمارية، فلاتر، ويب 3، أتمتة الجودة",
      ogImageAr: "/images/og/tarvix-engineering-system-ar.jpg",

      coverImageUrl: "/images/blog/engineering-system.jpg",
      readingTimeMin: 5,
      status: PostStatus.published,
      publishedAt: new Date("2025-01-15"),
      categorySlug: "engineering",
      tagSlugs: ["flutter", "architecture", "clean-architecture"],
    },
    {
      slug: "flutter-clean-architecture-patterns",

      isFeatured: true,
      isTrending: false,
      isPinned: false,
      priority: 2,
      language: "en",

      // انگلیسی
      titleEn: "Flutter Clean Architecture: Patterns That Scale",
      excerptEn:
        "Learn how to structure Flutter applications with clean architecture for long-term maintainability.",
      contentEn: `
        <h2>Clean Architecture in Flutter</h2>
        <p>Clean Architecture is not about folder structure — it's about dependency direction. The core principle is that dependencies point inward, toward the domain layer.</p>
        
        <h3>The Three Layers</h3>
        <ul>
          <li><strong>Domain Layer</strong> — Entities, use cases, and repository interfaces. This is the heart of your application.</li>
          <li><strong>Data Layer</strong> — Repository implementations, data sources, and models. This layer implements the domain contracts.</li>
          <li><strong>Presentation Layer</strong> — UI components, state management, and navigation. This layer depends on the domain layer.</li>
        </ul>
        
        <h3>Why This Works</h3>
        <p>By inverting dependencies, you create a system where business logic is independent of external concerns. This makes testing easier, reduces coupling, and allows for independent evolution of each layer.</p>
        
        <p>The result is a codebase that remains maintainable as your application grows.</p>
      `,
      seoTitleEn: "Flutter Clean Architecture - Scalable Patterns",
      seoDescriptionEn:
        "Master Flutter clean architecture with practical patterns for building scalable, maintainable applications.",
      keywordsEn: "flutter, clean architecture, patterns, scalable, maintainable",
      ogImageEn: "/images/og/flutter-clean-architecture.jpg",

      // فارسی
      titleFa: "معماری تمیز فلاتر: الگوهای مقیاس‌پذیر",
      excerptFa:
        "یاد بگیرید چگونه برنامه‌های فلاتر را با معماری تمیز برای نگهداری طولانی‌مدت ساختاردهی کنید.",
      contentFa: `
        <h2>معماری تمیز در فلاتر</h2>
        <p>معماری تمیز در مورد ساختار پوشه‌ها نیست — در مورد جهت وابستگی است. اصل اصلی این است که وابستگی‌ها به سمت داخل، به سمت لایه دامنه اشاره می‌کنند.</p>
        
        <h3>سه لایه</h3>
        <ul>
          <li><strong>لایه دامنه</strong> — موجودیت‌ها، موارد استفاده و واسط‌های مخزن. این قلب برنامه شماست.</li>
          <li><strong>لایه داده</strong> — پیاده‌سازی‌های مخزن، منابع داده و مدل‌ها. این لایه قراردادهای دامنه را پیاده‌سازی می‌کند.</li>
          <li><strong>لایه ارائه</strong> — کامپوننت‌های UI، مدیریت وضعیت و ناوبری. این لایه به لایه دامنه وابسته است.</li>
        </ul>
        
        <h3>چرا این کار می‌کند</h3>
        <p>با معکوس کردن وابستگی‌ها، سیستمی ایجاد می‌کنید که در آن منطق کسب‌وکار مستقل از دغدغه‌های خارجی است. این کار تست‌پذیری را آسان‌تر می‌کند، وابستگی را کاهش می‌دهد و امکان تکامل مستقل هر لایه را فراهم می‌کند.</p>
        
        <p>نتیجه یک کدبیس است که با رشد برنامه شما قابل نگهداری باقی می‌ماند.</p>
      `,
      seoTitleFa: "معماری تمیز فلاتر - الگوهای مقیاس‌پذیر",
      seoDescriptionFa:
        "معماری تمیز فلاتر را با الگوهای عملی برای ساخت برنامه‌های مقیاس‌پذیر و قابل نگهداری بیاموزید.",
      keywordsFa: "فلاتر، معماری تمیز، الگوها، مقیاس‌پذیر، قابل نگهداری",
      ogImageFa: "/images/og/flutter-clean-architecture-fa.jpg",

      // عربی
      titleAr: "هندسة فلاتر النظيفة: أنماط قابلة للتوسع",
      excerptAr:
        "تعلم كيفية هيكلة تطبيقات فلاتر باستخدام الهندسة النظيفة للصيانة طويلة المدى.",
      contentAr: `
        <h2>الهندسة النظيفة في فلاتر</h2>
        <p>الهندسة النظيفة لا تتعلق بهيكل المجلدات - بل تتعلق باتجاه التبعية. المبدأ الأساسي هو أن التبعيات تشير إلى الداخل، نحو طبقة المجال.</p>
        
        <h3>الطبقات الثلاث</h3>
        <ul>
          <li><strong>طبقة المجال</strong> — الكيانات وحالات الاستخدام وواجهات المستودع. هذا هو قلب تطبيقك.</li>
          <li><strong>طبقة البيانات</strong> — تطبيقات المستودع ومصادر البيانات والنماذج. تطبق هذه الطبقة عقود المجال.</li>
          <li><strong>طبقة العرض</strong> — مكونات واجهة المستخدم وإدارة الحالة والتنقل. تعتمد هذه الطبقة على طبقة المجال.</li>
        </ul>
        
        <h3>لماذا يعمل هذا</h3>
        <p>من خلال عكس التبعيات، يمكنك إنشاء نظام يكون فيه منطق الأعمال مستقلاً عن الاهتمامات الخارجية. هذا يجعل الاختبار أسهل، ويقلل من الاقتران، ويسمح بالتطور المستقل لكل طبقة.</p>
        
        <p>والنتيجة هي قاعدة شيفرة تظل قابلة للصيانة مع نمو تطبيقك.</p>
      `,
      seoTitleAr: "هندسة فلاتر النظيفة - أنماط قابلة للتوسع",
      seoDescriptionAr:
        "أتقن هندسة فلاتر النظيفة مع أنماط عملية لبناء تطبيقات قابلة للتوسع وقابلة للصيانة.",
      keywordsAr: "فلاتر، هندسة نظيفة، أنماط، قابلة للتوسع، قابلة للصيانة",
      ogImageAr: "/images/og/flutter-clean-architecture-ar.jpg",

      coverImageUrl: "/images/blog/flutter-clean-architecture.jpg",
      readingTimeMin: 8,
      status: PostStatus.published,
      publishedAt: new Date("2025-02-20"),
      categorySlug: "flutter",
      tagSlugs: ["flutter", "clean-architecture", "architecture"],
    },
    {
      slug: "web3-development-best-practices",

      isFeatured: false,
      isTrending: true,
      isPinned: false,
      priority: 3,
      language: "en",

      // انگلیسی
      titleEn: "Web3 Development: Best Practices for Production",
      excerptEn:
        "Essential patterns and practices for building production-ready Web3 applications.",
      contentEn: `
        <h2>Web3 Development in Production</h2>
        <p>Building Web3 applications requires a different mindset. Here are the key patterns we've learned from shipping production Web3 products.</p>
        
        <h3>Key Practices</h3>
        <ul>
          <li><strong>Gas Optimization</strong> — Every transaction costs money. Optimize smart contract calls and batch operations.</li>
          <li><strong>Error Handling</strong> — Web3 transactions can fail for many reasons. Implement robust error handling and user feedback.</li>
          <li><strong>State Management</strong> — Blockchain state is asynchronous. Use proper state management patterns to handle loading, success, and error states.</li>
          <li><strong>Security First</strong> — Audit smart contracts, use well-tested libraries, and implement proper access controls.</li>
        </ul>
        
        <h3>The Future of Web3</h3>
        <p>Web3 is evolving rapidly. Stay current with the latest standards, but always prioritize security and user experience over features.</p>
      `,
      seoTitleEn: "Web3 Development Best Practices for Production",
      seoDescriptionEn:
        "Learn essential patterns and practices for building production-ready Web3 applications with security and scalability in mind.",
      keywordsEn: "web3, blockchain, smart contracts, production, best practices",
      ogImageEn: "/images/og/web3-development.jpg",

      // فارسی
      titleFa: "توسعه وب۳: بهترین روش‌ها برای تولید",
      excerptFa:
        "الگوها و روش‌های ضروری برای ساخت برنامه‌های Web3 آماده تولید.",
      contentFa: `
        <h2>توسعه Web3 در محیط تولید</h2>
        <p>ساخت برنامه‌های Web3 نیاز به طرز فکر متفاوتی دارد. در اینجا الگوهای کلیدی که از عرضه محصولات Web3 تولیدی یاد گرفته‌ایم آورده شده است.</p>
        
        <h3>روش‌های کلیدی</h3>
        <ul>
          <li><strong>بهینه‌سازی گس</strong> — هر تراکنش هزینه دارد. فراخوانی‌های قرارداد هوشمند و عملیات دسته‌ای را بهینه کنید.</li>
          <li><strong>مدیریت خطا</strong> — تراکنش‌های Web3 ممکن است به دلایل زیادی شکست بخورند. مدیریت خطای قوی و بازخورد کاربر را پیاده‌سازی کنید.</li>
          <li><strong>مدیریت وضعیت</strong> — وضعیت بلاکچین ناهمزمان است. از الگوهای مدیریت وضعیت مناسب برای مدیریت حالت‌های بارگذاری، موفقیت و خطا استفاده کنید.</li>
          <li><strong>امنیت در اولویت</strong> — قراردادهای هوشمند را ممیزی کنید، از کتابخانه‌های تست شده استفاده کنید و کنترل‌های دسترسی مناسب را پیاده‌سازی کنید.</li>
        </ul>
        
        <h3>آینده Web3</h3>
        <p>Web3 به سرعت در حال تکامل است. با آخرین استانداردها به‌روز بمانید، اما همیشه امنیت و تجربه کاربری را بر ویژگی‌ها ترجیح دهید.</p>
      `,
      seoTitleFa: "بهترین روش‌های توسعه Web3 برای تولید",
      seoDescriptionFa:
        "الگوها و روش‌های ضروری برای ساخت برنامه‌های Web3 آماده تولید با امنیت و مقیاس‌پذیری.",
      keywordsFa: "وب۳، بلاکچین، قرارداد هوشمند، تولید، بهترین روش‌ها",
      ogImageFa: "/images/og/web3-development-fa.jpg",

      // عربی
      titleAr: "تطوير Web3: أفضل الممارسات للإنتاج",
      excerptAr:
        "الأنماط والممارسات الأساسية لبناء تطبيقات Web3 جاهزة للإنتاج.",
      contentAr: `
        <h2>تطوير Web3 في الإنتاج</h2>
        <p>يتطلب بناء تطبيقات Web3 عقلية مختلفة. فيما يلي الأنماط الرئيسية التي تعلمناها من شحن منتجات Web3 الإنتاجية.</p>
        
        <h3>الممارسات الرئيسية</h3>
        <ul>
          <li><strong>تحسين الغاز</strong> — كل معاملة تكلف مالاً. تحسين استدعاءات العقود الذكية والعمليات المجمعة.</li>
          <li><strong>معالجة الأخطاء</strong> — يمكن أن تفشل معاملات Web3 لأسباب عديدة. تنفيذ معالجة قوية للأخطاء وملاحظات المستخدم.</li>
          <li><strong>إدارة الحالة</strong> — حالة البلوكشين غير متزامنة. استخدم أنماط إدارة الحالة المناسبة للتعامل مع حالات التحميل والنجاح والخطأ.</li>
          <li><strong>الأمان أولاً</strong> — تدقيق العقود الذكية، واستخدام المكتبات المختبرة جيداً، وتنفيذ ضوابط الوصول المناسبة.</li>
        </ul>
        
        <h3>مستقبل Web3</h3>
        <p>يتطور Web3 بسرعة. ابق على اطلاع بأحدث المعايير، ولكن دائمًا أعط الأولوية للأمان وتجربة المستخدم على الميزات.</p>
      `,
      seoTitleAr: "أفضل ممارسات تطوير Web3 للإنتاج",
      seoDescriptionAr:
        "تعلم الأنماط والممارسات الأساسية لبناء تطبيقات Web3 جاهزة للإنتاج مع الأمان وقابلية التوسع.",
      keywordsAr: "ويب 3، بلوكشين، عقود ذكية، إنتاج، أفضل الممارسات",
      ogImageAr: "/images/og/web3-development-ar.jpg",

      coverImageUrl: "/images/blog/web3-development.jpg",
      readingTimeMin: 6,
      status: PostStatus.published,
      publishedAt: new Date("2025-03-10"),
      categorySlug: "web3",
      tagSlugs: ["web3", "blockchain", "typescript"],
    },
];
