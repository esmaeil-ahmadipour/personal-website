import { PrismaClient, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================
  // 1. ایجاد یا به‌روزرسانی Author
  // ============================================
  const author = await prisma.author.upsert({
    where: { slug: "esmaeil-ahmadipour" },
    update: {},
    create: {
      slug: "esmaeil-ahmadipour",
      email: "esmaeil@tarvix.org",
      firstNameEn: "Esmaeil",
      lastNameEn: "Ahmadipour",
      bioEn:
        "Founder & Lead Frontend/Mobile Engineer with 8+ years in mobile and web development. Leads architecture and delivery for enterprise Flutter, React, and Next.js applications.",
      firstNameFa: "اسماعیل",
      lastNameFa: "احمدی‌پور",
      bioFa:
        "بنیان‌گذار و مهندس ارشد فرانت‌اند و موبایل با بیش از ۸ سال تجربه در توسعه موبایل و وب. رهبری معماری و تحویل برنامه‌های سازمانی فلاتر، React و Next.js.",
      avatarUrl: "/images/authors/avatar-esmaeil.png",
    },
  });

  console.log(`✅ Author: ${author.firstNameEn} ${author.lastNameEn}`);

  // ============================================
  // 2. ایجاد یا به‌روزرسانی Category
  // ============================================
  const categories = [
    {
      slug: "engineering",
      nameEn: "Engineering",
      descriptionEn: "Software engineering insights and best practices",
      nameFa: "مهندسی نرم‌افزار",
      descriptionFa: "نکات و تجربیات مهندسی نرم‌افزار و بهترین روش‌ها",
    },
    {
      slug: "architecture",
      nameEn: "Architecture",
      descriptionEn: "System architecture and design patterns",
      nameFa: "معماری",
      descriptionFa: "معماری سیستم و الگوهای طراحی",
    },
    {
      slug: "flutter",
      nameEn: "Flutter",
      descriptionEn: "Flutter development tips and techniques",
      nameFa: "فلاتر",
      descriptionFa: "نکات و تکنیک‌های توسعه فلاتر",
    },
    {
      slug: "web3",
      nameEn: "Web3",
      descriptionEn: "Blockchain and Web3 development",
      nameFa: "وب۳",
      descriptionFa: "توسعه بلاکچین و وب۳",
    },
  ];

  const createdCategories = await Promise.all(
    categories.map(async (cat) => {
      return prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }),
  );

  console.log(`✅ Categories: ${createdCategories.length}`);

  // ============================================
  // 3. ایجاد یا به‌روزرسانی Tags
  // ============================================
  const tagData = [
    { slug: "flutter", nameEn: "Flutter", nameFa: "فلاتر" },
    { slug: "architecture", nameEn: "Architecture", nameFa: "معماری" },
    { slug: "nextjs", nameEn: "Next.js", nameFa: "نکست‌جی‌اس" },
    { slug: "react", nameEn: "React", nameFa: "ری‌اکت" },
    { slug: "web3", nameEn: "Web3", nameFa: "وب۳" },
    { slug: "blockchain", nameEn: "Blockchain", nameFa: "بلاکچین" },
    {
      slug: "clean-architecture",
      nameEn: "Clean Architecture",
      nameFa: "معماری تمیز",
    },
    { slug: "typescript", nameEn: "TypeScript", nameFa: "تایپ‌اسکریپت" },
  ];

  const createdTags = await Promise.all(
    tagData.map(async (tag) => {
      return prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      });
    }),
  );

  console.log(`✅ Tags: ${createdTags.length}`);

  // ============================================
  // 4. ایجاد پست‌های نمونه
  // ============================================
  const posts = [
    {
      slug: "introducing-tarvix-engineering-system",
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
      coverImageUrl: "/images/blog/engineering-system.jpg",
      readingTimeMin: 5,
      status: PostStatus.published, // ✅ استفاده از enum
      publishedAt: new Date("2025-01-15"),
      categorySlug: "engineering",
      tagSlugs: ["flutter", "architecture", "clean-architecture"],
    },
    {
      slug: "flutter-clean-architecture-patterns",
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
      coverImageUrl: "/images/blog/flutter-clean-architecture.jpg",
      readingTimeMin: 8,
      status: PostStatus.published, // ✅ استفاده از enum
      publishedAt: new Date("2025-02-20"),
      categorySlug: "flutter",
      tagSlugs: ["flutter", "clean-architecture", "architecture"],
    },
    {
      slug: "web3-development-best-practices",
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
      coverImageUrl: "/images/blog/web3-development.jpg",
      readingTimeMin: 6,
      status: PostStatus.published, // ✅ استفاده از enum
      publishedAt: new Date("2025-03-10"),
      categorySlug: "web3",
      tagSlugs: ["web3", "blockchain", "typescript"],
    },
  ];

  for (const postData of posts) {
    const category = await prisma.category.findUnique({
      where: { slug: postData.categorySlug },
    });

    if (!category) {
      console.log(`⚠️ Category not found: ${postData.categorySlug}`);
      continue;
    }

    const tags = await Promise.all(
      postData.tagSlugs.map(async (slug) => {
        const tag = await prisma.tag.findUnique({ where: { slug } });
        if (!tag) {
          console.log(`⚠️ Tag not found: ${slug}`);
        }
        return tag;
      }),
    );

    const existingPost = await prisma.post.findUnique({
      where: { slug: postData.slug },
    });

    if (existingPost) {
      console.log(`⏭️ Post already exists: ${postData.slug}`);
      continue;
    }

    const post = await prisma.post.create({
      data: {
        slug: postData.slug,
        titleEn: postData.titleEn,
        excerptEn: postData.excerptEn,
        contentEn: postData.contentEn,
        titleFa: postData.titleFa,
        excerptFa: postData.excerptFa,
        contentFa: postData.contentFa,
        coverImageUrl: postData.coverImageUrl,
        readingTimeMin: postData.readingTimeMin,
        status: postData.status, // ✅ الان درست است
        publishedAt: postData.publishedAt,
        authorId: author.id,
        categoryId: category.id,
        tags: {
          create: tags.filter(Boolean).map((tag) => ({
            tagId: tag!.id,
          })),
        },
      },
    });

    console.log(`✅ Post created: ${post.titleEn}`);
  }

  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
