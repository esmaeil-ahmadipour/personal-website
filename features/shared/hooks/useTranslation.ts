import { useDirection } from "@/providers/DirectionProvider";

type Lang = "en" | "fa";

const translations: Record<string, { en: string; fa: string }> = {
  home: { en: "Home", fa: "خانه" },
  platform: { en: "Platform", fa: "پلتفرم" },
  system: { en: "System", fa: "سیستم" },
  valueLoop: { en: "Value Loop", fa: "چرخه ارزش" },
  layers: { en: "Layers", fa: "لایه‌ها" },
  access: { en: "Access", fa: "دسترسی" },
  requestAccess: { en: "Request Early Access", fa: "درخواست دسترسی زودهنگام" },
  back: { en: "Back", fa: "بازگشت" },
  dev: { en: "Developer", fa: "توسعه" },

  heroTitleDev: {
    en: "The Tarvix Developer Platform — production systems engineering, shared.",
    fa: "پلتفرم توسعه‌دهندگان Tarvix — مهندسی سیستم‌های تولیدی، به اشتراک گذاشته شده",
  },
  heroSubDev: {
    en: "A codified engineering system for Flutter, Web, and Web3. Built to resolve active constraints across high-stakes domains — documented, tooled, and ready for adoption.",
    fa: "یک سیستم مهندسی مدون برای Flutter، Web و Web3. ساخته شده برای حل محدودیت‌های فعال در حوزه‌های پرریسک — مستند، مجهز و آماده برای پذیرش.",
  },
  heroIntent: {
    en: "Patterns tested by reality. Shared because good architecture should not stay locked inside agencies.",
    fa: "الگوهای آزمایش شده توسط واقعیت. به اشتراک گذاشته شده چون معماری خوب نباید درون آژانس‌ها قفل بماند.",
  },

  // Why
  whyTitle: { en: "Why this system exists", fa: "چرا این سیستم وجود دارد" },
  whyBadge1: {
    en: "Repeated production constraints",
    fa: "محدودیت‌های تولیدی مکرر",
  },
  whyText1: {
    en: "Every serious product faces the same challenges: unclear boundaries, inconsistent standards, and accumulating debt. This system codifies what we learned solving those problems across fintech, Web3, logistics, and ed-tech.",
    fa: "هر محصول جدی با چالش‌های یکسانی روبرو می‌شود: مرزهای نامشخص، استانداردهای ناسازگار و بدهی فنی انباشته. این سیستم آنچه را که ما در حل این مشکلات در حوزه‌های فین‌تک، Web3، لجستیک و اد-تک یاد گرفتیم، مدون می‌کند.",
  },
  whyBadge2: { en: "Shared engineering leverage", fa: "اهرم مهندسی مشترک" },
  whyText2: {
    en: "When architecture decisions are documented and enforced, teams stop debating the same questions. When quality is automated, human energy goes to product value, not firefighting.",
    fa: "وقتی تصمیمات معماری مستند و اعمال می‌شوند، تیم‌ها از بحث درباره سوالات تکراری دست می‌کشند. وقتی کیفیت خودکار می‌شود، انرژی انسانی به ارزش محصول می‌رود، نه به آتش‌نشانی.",
  },
  whyFooter: {
    en: "The platform gives you visibility into how we build. The system provides patterns you can adapt. A shared foundation grounded in engineering reality.",
    fa: "این پلتفرم به شما دیدگاهی از نحوه ساخت ما می‌دهد. سیستم الگوهایی را ارائه می‌دهد که می‌توانید تطبیق دهید. یک بنیاد مشترک مبتنی بر واقعیت مهندسی.",
  },

  // Substance
  substanceTitle: {
    en: "The Tarvix Engineering System",
    fa: "سیستم مهندسی Tarvix",
  },
  substanceSub: {
    en: "— decisions, not decoration",
    fa: "— تصمیمات، نه تزئینات",
  },
  substanceText1: {
    en: "A living body of architectural decisions, quality standards, automation patterns, and reference implementations. Every piece here was designed to resolve active structural friction — across fintech, blockchain, logistics, and ed-tech.",
    fa: "یک مجموعه زنده از تصمیمات معماری، استانداردهای کیفیت، الگوهای اتوماسیون و پیاده‌سازی‌های مرجع. هر بخش در اینجا برای حل اصطکاک ساختاری فعال طراحی شده است — در حوزه‌های فین‌تک، بلاکچین، لجستیک و اد-تک.",
  },
  substanceText2: {
    en: "Selected parts are available through the Developer Platform: as open patterns, documented standards, and reference implementations. Designed to provide immediate engineering leverage.",
    fa: "بخش‌های منتخب از طریق پلتفرم توسعه‌دهندگان در دسترس هستند: به عنوان الگوهای باز، استانداردهای مستند و پیاده‌سازی‌های مرجع. طراحی شده برای ارائه اهرم مهندسی فوری.",
  },
  substancePrinciple: {
    en: "One organizing principle: engineering leverage. Every decision exists to make future work faster, safer, and more predictable.",
    fa: "یک اصل سازمان‌دهنده: اهرم مهندسی. هر تصمیم وجود دارد تا کار آینده را سریع‌تر، ایمن‌تر و قابل‌پیش‌بینی‌تر کند.",
  },

  // Flywheel
  flywheelTitle: { en: "The system flywheel", fa: "چرخه پرواز سیستم" },
  flywheelSub: {
    en: "Each cycle increases leverage for everyone who comes next.",
    fa: "هر چرخه اهرم را برای همه کسانی که بعد از شما می‌آیند افزایش می‌دهد.",
  },
  flywheelAdopt: { en: "Adopt", fa: "پذیرش" },
  flywheelAdoptDesc: {
    en: "Teams integrate patterns into their codebases",
    fa: "تیم‌ها الگوها را در کدهای خود ادغام می‌کنند",
  },
  flywheelValidate: { en: "Validate", fa: "اعتبارسنجی" },
  flywheelValidateDesc: {
    en: "Active deployment reveals what holds up",
    fa: "استقرار فعال نشان می‌دهد چه چیزی مقاوم است",
  },
  flywheelRefine: { en: "Refine", fa: "بهبود" },
  flywheelRefineDesc: {
    en: "Improvements return to documentation and tooling",
    fa: "بهبودها به مستندات و ابزارها بازمی‌گردند",
  },
  flywheelReapply: { en: "Reapply", fa: "اعمال مجدد" },
  flywheelReapplyDesc: {
    en: "Refined patterns become the baseline for the next cycle",
    fa: "الگوهای بهبودیافته به خط پایه برای چرخه بعدی تبدیل می‌شوند",
  },

  // Values
  valueIndividual: { en: "Individual developer", fa: "توسعه‌دهنده فردی" },
  valueIndividualText: {
    en: "Leverage that compounds. Clear patterns reduce cognitive load. Documented decisions eliminate guesswork. Each cycle makes the system more robust — and you benefit without reinvention.",
    fa: "اهرمی که رشد می‌کند. الگوهای واضح بار شناختی را کاهش می‌دهند. تصمیمات مستند حدس و گمان را حذف می‌کنند. هر چرخه سیستم را مقاوم‌تر می‌کند — و شما بدون بازآفرینی بهره‌مند می‌شوید.",
  },
  valueTeam: { en: "Team / company", fa: "تیم / شرکت" },
  valueTeamText: {
    en: "Lower coordination costs over time. Shared vocabulary across projects. Reduced architectural drift. New members onboard faster because patterns are consistent — not because of hidden tribal knowledge.",
    fa: "کاهش هزینه‌های هماهنگی در طول زمان. واژگان مشترک در پروژه‌ها. کاهش انحراف معماری. اعضای جدید سریع‌تر عضو می‌شوند چون الگوها سازگار هستند — نه به خاطر دانش پنهان قبیله‌ای.",
  },
  valueEcosystem: { en: "Engineering ecosystem", fa: "اکوسیستم مهندسی" },
  valueEcosystemText: {
    en: "Better defaults for everyone. Open documentation raises the industry baseline. Reference implementations become teaching tools. Quality spreads because functional design outlasts transient trends.",
    fa: "پیش‌فرض‌های بهتر برای همه. مستندات باز سطح پایه صنعت را بالا می‌برد. پیاده‌سازی‌های مرجع به ابزارهای آموزشی تبدیل می‌شوند. کیفیت گسترش می‌یابد چون طراحی عملکردی از روندهای زودگذر بیشتر دوام می‌آورد.",
  },

  // Layers
  layersTitle: {
    en: "System layers — engineering philosophy",
    fa: "لایه‌های سیستم — فلسفه مهندسی",
  },
  layersSub: {
    en: "Each layer represents a commitment to quality, not a checklist of tools.",
    fa: "هر لایه نشان‌دهنده تعهد به کیفیت است، نه چک‌لیستی از ابزارها.",
  },
  layer1: {
    en: "Layer 1 — Modular Domain Boundaries",
    fa: "لایه ۱ — مرزهای دامنه ماژولار",
  },
  layer1Text: {
    en: "Feature-first organization. Clean separation between domain logic, data access, and presentation. Dependency direction flows inward. Changes localize — cross-module impact is explicit and reviewed.",
    fa: "سازمان‌دهی مبتنی بر ویژگی. جداسازی تمیز بین منطق دامنه، دسترسی به داده و ارائه. جهت وابستگی به سمت داخل جریان دارد. تغییرات محلی می‌شوند — تأثیر بین ماژول‌ها صریح و بازبینی می‌شود.",
  },
  layer2: {
    en: "Layer 2 — Living Documentation Standards",
    fa: "لایه ۲ — استانداردهای مستندسازی زنده",
  },
  layer2Text: {
    en: "Architectural Decision Records (ADRs) as first-class citizens. Coding conventions that prioritize readability over cleverness. Design system implementation guidelines that bridge design and code without translation gaps.",
    fa: "سوابق تصمیمات معماری (ADR) به عنوان شهروندان درجه یک. قراردادهای کدنویسی که خوانایی را بر زیرکی ترجیح می‌دهند. دستورالعمل‌های پیاده‌سازی سیستم طراحی که طراحی و کد را بدون شکاف ترجمه پل می‌زنند.",
  },
  layer3: {
    en: "Layer 3 — Automated Quality Gates",
    fa: "لایه ۳ — دروازه‌های کیفیت خودکار",
  },
  layer3Text: {
    en: "Continuous integration that enforces architecture rules before merge. Dependency graphs that prevent circular imports. Coverage thresholds that fail builds, not just report. No human approval overrides automated gates.",
    fa: "یکپارچه‌سازی مداوم که قوانین معماری را قبل از ادغام اعمال می‌کند. گراف‌های وابستگی که از واردات دایره‌ای جلوگیری می‌کنند. آستانه‌های پوشش که ساخت‌ها را شکست می‌دهند، نه فقط گزارش می‌دهند. هیچ تایید انسانی دروازه‌های خودکار را لغو نمی‌کند.",
  },
  layer4: {
    en: "Layer 4 — Reference Implementations",
    fa: "لایه ۴ — پیاده‌سازی‌های مرجع",
  },
  layer4Text: {
    en: "Applied reference setups that clarify architectural decisions and accelerate adoption. Each demonstrates how structural principles behave in implementation, reducing ambiguity and providing a rigorous starting point for engineering teams.",
    fa: "تنظیمات مرجع کاربردی که تصمیمات معماری را روشن می‌کنند و پذیرش را تسریع می‌بخشند. هر کدام نشان می‌دهند که اصول ساختاری چگونه در پیاده‌سازی رفتار می‌کنند، ابهام را کاهش داده و نقطه شروع دقیقی برای تیم‌های مهندسی فراهم می‌کنند.",
  },
  layer4Footer: {
    en: "Flutter production reference · Web3 integration example · Backend service blueprint · Design system implementation",
    fa: "مرجع تولید Flutter · مثال یکپارچه‌سازی Web3 · طرح سرویس بک‌اند · پیاده‌سازی سیستم طراحی",
  },

  // Principles
  principlesTitle: { en: "Operating principles", fa: "اصول عملیاتی" },
  principle1Badge: { en: "Readability", fa: "خوانایی" },
  principle1Title: { en: "Clarity over cleverness", fa: "وضوح بر زیرکی" },
  principle1Text: {
    en: "Code is read far more often than it's written. Patterns that surprise are patterns that fail. We optimize for comprehension, not conciseness.",
    fa: "کد بسیار بیشتر از نوشته شدن خوانده می‌شود. الگوهایی که غافلگیر می‌کنند، الگوهایی هستند که شکست می‌خورند. ما برای درک‌پذیری بهینه می‌کنیم، نه مختصرنویسی.",
  },
  principle2Badge: { en: "Explicit standards", fa: "استانداردهای صریح" },
  principle2Title: {
    en: "Standards over tribal knowledge",
    fa: "استانداردها بر دانش قبیله‌ای",
  },
  principle2Text: {
    en: "If it's not documented and enforced, it doesn't exist. We prefer explicit rules that computers can check over unwritten agreements that humans must remember.",
    fa: "اگر مستند و اعمال نشده باشد، وجود ندارد. ما قوانین صریحی را ترجیح می‌دهیم که رایانه‌ها بتوانند بررسی کنند بر توافق‌های نانوشته‌ای که انسان‌ها باید به خاطر بسپارند.",
  },
  principle3Badge: { en: "Reusable precedent", fa: "سابقه قابل استفاده مجدد" },
  principle3Title: {
    en: "Reusable decisions over repeated debate",
    fa: "تصمیمات قابل استفاده مجدد بر بحث مکرر",
  },
  principle3Text: {
    en: "Every architecture question worth asking once is worth documenting as a precedent. We invest in decisions that compound across teams and projects.",
    fa: "هر سوال معماری که ارزش یک بار پرسیدن را دارد، ارزش مستند کردن به عنوان یک سابقه را دارد. ما روی تصمیماتی سرمایه‌گذاری می‌کنیم که در تیم‌ها و پروژه‌ها رشد می‌کنند.",
  },

  // Access
  accessTitle: {
    en: "Explore the Engineering System",
    fa: "سیستم مهندسی را کشف کنید",
  },
  accessGuide: { en: "Architecture Guide", fa: "راهنمای معماری" },
  accessGuideText: {
    en: "Understand the foundation. Documentation detailing modular boundaries, layer decisions, and the rationale behind each pattern.",
    fa: "بنیان را درک کنید. مستندات دقیق مرزهای ماژولار، تصمیمات لایه‌ها و منطق پشت هر الگو.",
  },
  accessGuideLink: { en: "Read documentation", fa: "مطالعه مستندات" },
  accessGithub: { en: "Reference Implementations", fa: "پیاده‌سازی‌های مرجع" },
  accessGithubText: {
    en: "Inspect the implementation. Functional, forkable repositories demonstrating how structural decisions behave in applied environments.",
    fa: "پیاده‌سازی را بررسی کنید. مخازن عملکردی و قابل انشعاب که نشان می‌دهند تصمیمات ساختاری چگونه در محیط‌های کاربردی رفتار می‌کنند.",
  },
  accessGithubLink: { en: "Explore on GitHub", fa: "بررسی در GitHub" },
  accessReview: { en: "Architecture Review", fa: "بازبینی معماری" },
  accessReviewText: {
    en: "Engage for deeper alignment. A structured engineering review to help teams adapt these standards directly to their codebases.",
    fa: "برای هم‌ترازی عمیق‌تر مشارکت کنید. یک بازبینی مهندسی ساختاریافته برای کمک به تیم‌ها در تطبیق این استانداردها مستقیماً با کدهای خود.",
  },
  accessFooter: {
    en: "The platform provides visibility into how robust systems are structured, giving teams the blueprints needed to establish their own durable engineering standards.",
    fa: "این پلتفرم دیدگاهی از نحوه ساخت سیستم‌های مقاوم ارائه می‌دهد و به تیم‌ها نقشه‌های لازم برای ایجاد استانداردهای مهندسی پایدار خود را می‌دهد.",
  },

  // Final
  finalTitle: {
    en: "Engineering systems only matter when rigor is preserved.",
    fa: "سیستم‌های مهندسی فقط زمانی اهمیت دارند که دقت حفظ شود.",
  },
  finalText: {
    en: "This foundation exists to document decisions, enforce architectural constraints, and cultivate a durable engineering culture.",
    fa: "این بنیاد برای مستندسازی تصمیمات، اعمال محدودیت‌های معماری و پرورش یک فرهنگ مهندسی پایدار وجود دارد.",
  },

  // Footer
  footer: {
    en: "© 2025 Tarvix — engineering system for digital products. Grounded in rigorous constraints across fintech, Web3, and SaaS.",
    fa: "© ۲۰۲۵ Tarvix — سیستم مهندسی برای محصولات دیجیتال. مبتنی بر محدودیت‌های دقیق در فین‌تک، Web3 و SaaS.",
  },
  footerTags: {
    en: "Modular Architecture · Living Standards · Quality Gates · Reference Implementations",
    fa: "معماری ماژولار · استانداردهای زنده · دروازه‌های کیفیت · پیاده‌سازی‌های مرجع",
  },

  // به useTranslation.ts اضافه کنید:

  // Navigation
  capabilities: { en: "Capabilities", fa: "قابلیت‌ها" },
  work: { en: "Work", fa: "نمونه کارها" },
  foundation: { en: "Foundation", fa: "بنیاد" },
  team: { en: "Team", fa: "تیم" },
  contact: { en: "Contact", fa: "تماس" },

  // Hero
  heroTitle: {
    en: "Architecture-first product engineering for serious teams.",
    fa: "مهندسی محصول با اولویت معماری برای تیم‌های حرفه‌ای.",
  },
  heroSub: {
    en: "Tarvix builds scalable digital foundations — Flutter, Web3, and smart contract systems with clean architecture and maintainable codebases. For CTOs and founders who need more than just implementation.",
    fa: "Tarvix بنیادهای دیجیتال مقیاس‌پذیر می‌سازد — فلاتر، Web3 و سیستم‌های قرارداد هوشمند با معماری تمیز و کدهای قابل نگهداری. برای مدیران فنی و بنیان‌گذارانی که به چیزی فراتر از پیاده‌سازی نیاز دارند.",
  },
  startProject: { en: "Start a project", fa: "شروع پروژه" },
  requestAudit: {
    en: "Request architecture audit",
    fa: "درخواست بازبینی معماری",
  },
  exploreWork: { en: "Explore our work", fa: "مشاهده نمونه کارها" },
  viewEngineeringSystem: {
    en: "View our Engineering System",
    fa: "مشاهده سیستم مهندسی",
  },

  // Capabilities
  capabilitiesTitle: {
    en: "Engineering capabilities",
    fa: "قابلیت‌های مهندسی",
  },
  capBadge1: { en: "Cross-platform", fa: "چندسکویی" },
  capTitle1: { en: "Flutter Development", fa: "توسعه فلاتر" },
  capDesc1: {
    en: "iOS, Android, Web, and desktop from a single codebase with modular architecture and production-grade quality.",
    fa: "iOS، Android، Web و دسکتاپ از یک کدبیس با معماری ماژولار و کیفیت تولید.",
  },
  capBadge2: { en: "Modern Web", fa: "وب مدرن" },
  capTitle2: { en: "Web Application Development", fa: "توسعه برنامه‌های وب" },
  capDesc2: {
    en: "React, Vue, and responsive systems with performance optimization and accessibility standards.",
    fa: "ری‌اکت، ویو و سیستم‌های واکنش‌گرا با بهینه‌سازی عملکرد و استانداردهای دسترسی‌پذیری.",
  },
  capBadge3: { en: "Blockchain", fa: "بلاکچین" },
  capTitle3: { en: "Web3 & Smart Contracts", fa: "Web3 و قراردادهای هوشمند" },
  capDesc3: {
    en: "dApp frontends, wallet UX, gas abstraction, and secure smart contract integration for crypto products.",
    fa: "فرانت‌اند dApp، UX کیف پول، انتزاع گس و یکپارچه‌سازی امن قرارداد هوشمند برای محصولات کریپتو.",
  },
  capBadge4: { en: "Design Implementation", fa: "پیاده‌سازی طراحی" },
  capTitle4: { en: "UI/UX Execution", fa: "اجرای UI/UX" },
  capDesc4: {
    en: "Pixel-perfect design system implementation with component-driven development and design-to-code workflows.",
    fa: "پیاده‌سازی دقیق سیستم طراحی با توسعه مبتنی بر کامپوننت و جریان‌های طراحی به کد.",
  },
  capBadge5: { en: "System Architecture", fa: "معماری سیستم" },
  capTitle5: { en: "Modular System Design", fa: "طراحی سیستم ماژولار" },
  capDesc5: {
    en: "Microservices, clean architecture, and scalable foundations that reduce technical debt over time.",
    fa: "میکروسرویس‌ها، معماری تمیز و بنیادهای مقیاس‌پذیر که بدهی فنی را در طول زمان کاهش می‌دهند.",
  },
  capBadge6: { en: "Team Enablement", fa: "توانمندسازی تیم" },
  capTitle6: { en: "Engineering Consulting", fa: "مشاوره مهندسی" },
  capDesc6: {
    en: "Architecture reviews, team training, and technical strategy for organizations scaling their product development.",
    fa: "بازبینی معماری، آموزش تیم و استراتژی فنی برای سازمان‌هایی که توسعه محصول خود را مقیاس‌دهی می‌کنند.",
  },

  // Why Tarvix
  whyTitle0: {
    en: "Why engineering teams choose Tarvix",
    fa: "چرا تیم‌های مهندسی Tarvix را انتخاب می‌کنند",
  },
  whyTitle1: {
    en: "Architecture-first development",
    fa: "توسعه با اولویت معماری",
  },
  whyDesc1: {
    en: "We don't start coding blind. Every engagement begins with a technical foundation review and architectural planning.",
    fa: "ما کدنویسی را کورکورانه شروع نمی‌کنیم. هر همکاری با بررسی بنیاد فنی و برنامه‌ریزی معماری آغاز می‌شود.",
  },
  whyTitle2: {
    en: "Modular & maintainable systems",
    fa: "سیستم‌های ماژولار و قابل نگهداری",
  },
  whyDesc2: {
    en: "Clean architecture, enforced patterns, and automated quality gates ensure your codebase stays healthy for years.",
    fa: "معماری تمیز، الگوهای اعمال‌شده و دروازه‌های کیفیت خودکار تضمین می‌کنند کدبیس شما برای سال‌ها سالم بماند.",
  },
  whyTitle3: { en: "Scalable product execution", fa: "اجرای محصول مقیاس‌پذیر" },
  whyDesc3: {
    en: "From design to deployment — we deliver with structure, speed, and technical integrity. No shortcuts.",
    fa: "از طراحی تا استقرار — ما با ساختار، سرعت و یکپارچگی فنی تحویل می‌دهیم. بدون میان‌بر.",
  },

  // Portfolio
  portfolioTitle: {
    en: "Selected engineering work",
    fa: "نمونه کارهای مهندسی منتخب",
  },
  tarvixRole: { en: "Tarvix role", fa: "نقش Tarvix" },

  // Project Keys
  projectPactusTitle: { en: "Pactus Node Management", fa: "مدیریت گره Pactus" },
  projectPactusCategory: {
    en: "Blockchain Infrastructure",
    fa: "زیرساخت بلاکچین",
  },
  projectPactusRole: {
    en: "Flutter architecture & GUI lead",
    fa: "معماری فلاتر و سرپرست GUI",
  },
  projectPactusDesc: {
    en: "Official GUI for Pactus blockchain — node management, validator operations, and cross-platform desktop app.",
    fa: "GUI رسمی برای بلاکچین Pactus — مدیریت گره، عملیات اعتبارسنج و برنامه دسکتاپ چندسکویی.",
  },

  projectDaneshjouyarTitle: { en: "Daneshjouyar", fa: "دانشجویار" },
  projectDaneshjouyarCategory: {
    en: "EdTech Platform",
    fa: "پلتفرم آموزش فناوری",
  },
  projectDaneshjouyarRole: {
    en: "Flutter team lead & architecture",
    fa: "سرپرست تیم فلاتر و معماری",
  },
  projectDaneshjouyarDesc: {
    en: "Student life platform serving 50,000+ users with PWA, Android, and iOS support.",
    fa: "پلتفرم زندگی دانشجویی با پشتیبانی از PWA، Android و iOS برای بیش از ۵۰٬۰۰۰ کاربر.",
  },

  projectTONTitle: {
    en: "TON Crypto Payment System",
    fa: "سیستم پرداخت ارز دیجیتال TON",
  },
  projectTONCategory: { en: "Web3 Fintech", fa: "فین‌تک Web3" },
  projectTONRole: {
    en: "Backend & smart contract integration",
    fa: "بک‌اند و یکپارچه‌سازی قرارداد هوشمند",
  },
  projectTONDesc: {
    en: "Cryptocurrency payment solution on TON network with automated consolidation.",
    fa: "راه‌حل پرداخت ارز دیجیتال در شبکه TON با تجمیع خودکار.",
  },

  projectAdminTitle: {
    en: "Admin Panel Microservices",
    fa: "میکروسرویس‌های پنل مدیریت",
  },
  projectAdminCategory: { en: "Enterprise Backend", fa: "بک‌اند سازمانی" },
  projectAdminRole: {
    en: "Backend architecture & implementation",
    fa: "معماری و پیاده‌سازی بک‌اند",
  },
  projectAdminDesc: {
    en: "Scalable microservices-based admin panel supporting 10,000+ concurrent users.",
    fa: "پنل مدیریت مبتنی بر میکروسرویس مقیاس‌پذیر پشتیبانی از بیش از ۱۰٬۰۰۰ کاربر همزمان.",
  },

  projectMohsenTitle: {
    en: "Mohsen Grocery Ecosystem",
    fa: "اکوسیستم خواربارفروشی محسن",
  },
  projectMohsenCategory: { en: "Retail Tech", fa: "فناوری خرده‌فروشی" },
  projectMohsenRole: {
    en: "Lead Flutter developer",
    fa: "توسعه‌دهنده ارشد فلاتر",
  },
  projectMohsenDesc: {
    en: "Complete grocery management system with warehouse, delivery tracking, and Bluetooth printing.",
    fa: "سیستم مدیریت کامل خواربارفروشی با انبار، ردیابی تحویل و چاپ بلوتوث.",
  },

  projectPackagesTitle: {
    en: "Custom Flutter Packages",
    fa: "پکیج‌های سفارشی فلاتر",
  },
  projectPackagesCategory: { en: "Open Source", fa: "متن‌باز" },
  projectPackagesRole: {
    en: "Package author & maintainer",
    fa: "نویسنده و نگهدارنده پکیج",
  },
  projectPackagesDesc: {
    en: "Published packages for Jalali date picker, fast cached images, and utilities.",
    fa: "پکیج‌های منتشر شده برای انتخابگر تاریخ جلالی، تصاویر کش شده سریع و ابزارها.",
  },

  // Foundation
  foundationTitle: {
    en: "Tarvix Engineering Foundation",
    fa: "بنیاد مهندسی Tarvix",
  },
  foundationSub: {
    en: "A productized engineering foundation for teams building large products without unnecessary friction.",
    fa: "یک بنیاد مهندسی محصول‌محور برای تیم‌هایی که محصولات بزرگ را بدون اصطکاک غیرضروری می‌سازند.",
  },
  foundationTitle1: { en: "Reduce technical debt", fa: "کاهش بدهی فنی" },
  foundationDesc1: {
    en: "Early architecture decisions influence 80% of maintenance costs. We embed boundaries from day zero.",
    fa: "تصمیمات اولیه معماری بر ۸۰٪ هزینه‌های نگهداری تأثیر می‌گذارند. ما از روز صفر مرزها را تعبیه می‌کنیم.",
  },
  foundationTitle2: { en: "Scalable architecture", fa: "معماری مقیاس‌پذیر" },
  foundationDesc2: {
    en: "Domain-driven design, dependency inversion, and modular structure. Scale teams without merge conflicts.",
    fa: "طراحی مبتنی بر دامنه، وارونگی وابستگی و ساختار ماژولار. تیم‌ها را بدون تعارض ادغام مقیاس‌دهی کنید.",
  },
  foundationTitle3: { en: "Engineering consistency", fa: "ثبات مهندسی" },
  foundationDesc3: {
    en: "Automated quality gates, architecture tests, and CI/CD pipelines that keep your codebase clean.",
    fa: "دروازه‌های کیفیت خودکار، تست‌های معماری و خطوط لوله CI/CD که کدبیس شما را تمیز نگه می‌دارند.",
  },
  foundationTitle4: { en: "For serious teams", fa: "برای تیم‌های حرفه‌ای" },
  foundationDesc4: {
    en: "CTOs, product leads, and engineering directors scaling mission-critical products from startup to enterprise.",
    fa: "مدیران فنی، سرپرستان محصول و مدیران مهندسی که محصولات حیاتی را از استارتاپ تا سازمان مقیاس‌دهی می‌کنند.",
  },
  useFoundation: {
    en: "Use Tarvix as your foundation",
    fa: "از Tarvix به عنوان بنیاد خود استفاده کنید",
  },
  scheduleReview: {
    en: "Schedule architecture review",
    fa: "برنامه‌ریزی بازبینی معماری",
  },

  // Blog
  blogTitle: { en: "Engineering insights", fa: "بینش‌های مهندسی" },
  blogBadge1: { en: "Architecture", fa: "معماری" },
  blogTitle1: {
    en: "Why clean architecture still matters",
    fa: "چرا معماری تمیز هنوز اهمیت دارد",
  },
  blogDesc1: {
    en: "Separating domain from frameworks reduces friction and technical debt in large codebases.",
    fa: "جداسازی دامنه از فریم‌ورک‌ها اصطکاک و بدهی فنی را در کدبیس‌های بزرگ کاهش می‌دهد.",
  },
  blogBadge2: { en: "Flutter", fa: "فلاتر" },
  blogTitle2: {
    en: "Scaling Flutter with modular design",
    fa: "مقیاس‌دهی فلاتر با طراحی ماژولار",
  },
  blogDesc2: {
    en: "Feature-first modules and generated routes for teams of 10+ engineers.",
    fa: "ماژول‌های مبتنی بر ویژگی و مسیرهای تولید شده برای تیم‌های بیش از ۱۰ مهندس.",
  },
  blogBadge3: { en: "Web3 UX", fa: "UX وب۳" },
  blogTitle3: {
    en: "Designing usable crypto products",
    fa: "طراحی محصولات کریپتو قابل استفاده",
  },
  blogDesc3: {
    en: "Reducing cognitive load and making smart contracts accessible to mainstream users.",
    fa: "کاهش بار شناختی و قابل دسترس کردن قراردادهای هوشمند برای کاربران عمومی.",
  },
  readMore: { en: "Read more", fa: "بیشتر بخوانید" },

  // Team
  teamTitle: { en: "Engineering leadership", fa: "رهبری مهندسی" },
  teamEsmaeilRole: {
    en: "Founder & Flutter Team Lead",
    fa: "بنیان‌گذار و سرپرست تیم فلاتر",
  },
  teamEsmaeilBio: {
    en: "8+ years in mobile development. Leads architecture and delivery for enterprise Flutter applications. Open source contributor and Pactus GUI manager.",
    fa: "بیش از ۸ سال در توسعه موبایل. رهبری معماری و تحویل برنامه‌های فلاتر سازمانی. مشارکت‌کننده متن‌باز و مدیر GUI Pactus.",
  },
  teamMiladRole: { en: "Backend & Web3 Engineer", fa: "مهندس بک‌اند و وب۳" },
  teamMiladBio: {
    en: "3+ years in microservices and blockchain integration. Specializes in Nest.js, Golang, and smart contract systems.",
    fa: "بیش از ۳ سال در میکروسرویس‌ها و یکپارچه‌سازی بلاکچین. تخصص در Nest.js، Golang و سیستم‌های قرارداد هوشمند.",
  },
  teamSinaRole: { en: "Lead Product Designer", fa: "طراح ارشد محصول" },
  teamSinaBio: {
    en: "Product designer creating design systems for enterprise applications. Google UX certified with 10+ admin panel designs.",
    fa: "طراح محصول با ایجاد سیستم‌های طراحی برای برنامه‌های سازمانی. دارای گواهی UX گوگل با بیش از ۱۰ طراحی پنل مدیریت.",
  },

  // Tech Stack
  stackTitle: { en: "Technology stack", fa: "پشته فناوری" },
  stackFrontend: { en: "Frontend", fa: "فرانت‌اند" },
  stackBackend: { en: "Backend", fa: "بک‌اند" },
  stackInfra: { en: "Infrastructure", fa: "زیرساخت" },

  // Contact
  contactTitle: { en: "Start a conversation", fa: "شروع مکالمه" },
  contactDesc: {
    en: "Tell us about your product vision or architecture challenge. We'll respond within 24 hours.",
    fa: "در مورد چشم‌انداز محصول یا چالش معماری خود به ما بگویید. ما ظرف ۲۴ ساعت پاسخ خواهیم داد.",
  },
  fullName: { en: "Full name", fa: "نام کامل" },
  email: { en: "Email", fa: "ایمیل" },
  serviceFlutter: { en: "Flutter development", fa: "توسعه فلاتر" },
  serviceWeb: { en: "Web application", fa: "برنامه وب" },
  serviceWeb3: { en: "Web3 / Crypto product", fa: "محصول وب۳ / کریپتو" },
  serviceConsulting: {
    en: "Software architecture consulting",
    fa: "مشاوره معماری نرم‌افزار",
  },
  serviceFoundation: {
    en: "Tarvix foundation package",
    fa: "پکیج بنیاد Tarvix",
  },
  serviceAudit: {
    en: "Architecture audit request",
    fa: "درخواست بازبینی معماری",
  },
  projectDesc: {
    en: "Describe your project or architecture needs...",
    fa: "پروژه یا نیازهای معماری خود را شرح دهید...",
  },
  sendInquiry: { en: "Send inquiry", fa: "ارسال درخواست" },
  contactSuccess: {
    en: "Thank you. Tarvix will reach out within 24 hours to discuss your project.",
    fa: "متشکریم. Tarvix ظرف ۲۴ ساعت برای بررسی پروژه شما با شما تماس خواهد گرفت.",
  },

  // Audit
  auditTitle: { en: "Free architecture audit", fa: "بازبینی معماری رایگان" },
  auditDesc: {
    en: "Not ready to commit? Request a 30-minute technical review of your current architecture or product plan. No obligation. No sales pitch.",
    fa: "آماده تعهد نیستید؟ یک بررسی فنی ۳۰ دقیقه‌ای از معماری فعلی یا برنامه محصول خود درخواست کنید. بدون تعهد. بدون فروش.",
  },
  serviceSelect: { en: "Service type", fa: "نوع خدمت" },

  auditCTA: {
    en: "Request audit →",
    fa: "درخواست بازبینی",
  },
  contactSuccessDesc: {
    en: "Tarvix will reach out within 24 hours to discuss your project.",
    fa: "Tarvix ظرف ۲۴ ساعت برای بررسی پروژه شما با شما تماس خواهد گرفت.",
  },
  emailSent: {
    en: "Email sent",
    fa: "ایمیل ارسال شد",
  },
  responseWithin24h: {
    en: "Response within 24h",
    fa: "پاسخ در کمتر از ۲۴ ساعت",
  },
  contactSuccess1: {
    en: "Thank you!",
    fa: "متشکریم!",
  },
  contactSuccessDesc1: {
    en: "Tarvix will reach out within 24 hours to discuss your project.",
    fa: "Tarvix ظرف ۲۴ ساعت برای بررسی پروژه شما با شما تماس خواهد گرفت.",
  },

  // ===== DIALOG KEYS =====
  dialogTitle: {
    en: "Request Early Access",
    fa: "درخواست دسترسی زودهنگام",
  },
  dialogDesc: {
    en: "Request access to the Tarvix Engineering System. Share your GitHub, technical context, and adoption or collaboration goals. Requests are reviewed manually and selected participants may be invited to repository discussions and early collaboration.",
    fa: "درخواست دسترسی به سیستم مهندسی Tarvix. گیت‌هاب، زمینه فنی و اهداف پذیرش یا همکاری خود را به اشتراک بگذارید. درخواست‌ها به صورت دستی بررسی می‌شوند و شرکت‌کنندگان منتخب ممکن است به بحث‌های مخزن و همکاری اولیه دعوت شوند.",
  },
  workEmail: {
    en: "Work Email",
    fa: "ایمیل کاری",
  },
  roleTitle: {
    en: "Role / Title",
    fa: "نقش / عنوان",
  },
  companyTeam: {
    en: "Company or Team",
    fa: "شرکت یا تیم",
  },
  githubUsername: {
    en: "GitHub Username",
    fa: "نام کاربری گیت‌هاب",
  },
  preferredStack: {
    en: "Preferred Stack",
    fa: "پشته ترجیحی",
  },
  whyAccess: {
    en: "Why do you want access?",
    fa: "چرا به دسترسی نیاز دارید؟",
  },
  stackFlutter: {
    en: "Flutter (available now)",
    fa: "فلاتر (در دسترس است)",
  },
  stackReact: {
    en: "React (interest only)",
    fa: "ری‌اکت (فقط علاقه‌مندی)",
  },
  stackDjango: {
    en: "Django (interest only)",
    fa: "جنگو (فقط علاقه‌مندی)",
  },
  stackNestJS: {
    en: "NestJS (interest only)",
    fa: "نست‌جی‌اس (فقط علاقه‌مندی)",
  },
  stackHelp: {
    en: "Flutter CleanArc (Bloc/Riverpod) is supported in the current release. Other stacks are in the interest‑gathering phase.",
    fa: "فلاتر CleanArc (Bloc/Riverpod) در نسخه فعلی پشتیبانی می‌شود. سایر پشته‌ها در مرحله جمع‌آوری علاقه‌مندی هستند.",
  },
  githubHelp: {
    en: "Please provide a valid GitHub username.",
    fa: "لطفاً یک نام کاربری گیت‌هاب معتبر وارد کنید.",
  },
  cancel: {
    en: "Cancel",
    fa: "انصراف",
  },
  submitting: {
    en: "Submitting...",
    fa: "در حال ارسال...",
  },
  requestReceived: {
    en: "Request Received",
    fa: "درخواست دریافت شد",
  },
  requestReceivedText1: {
    en: "Thanks — your request has been received.",
    fa: "متشکریم — درخواست شما دریافت شد.",
  },
  requestReceivedText2: {
    en: "We will review it and contact you if your access is approved.",
    fa: "ما آن را بررسی می‌کنیم و در صورت تأیید دسترسی با شما تماس خواهیم گرفت.",
  },
  close: {
    en: "Close",
    fa: "بستن",
  },
  fullNameRequired: {
    en: "Full name is required",
    fa: "نام کامل الزامی است",
  },
  validEmailRequired: {
    en: "Valid email is required",
    fa: "ایمیل معتبر الزامی است",
  },
  githubRequired: {
    en: "GitHub username is required",
    fa: "نام کاربری گیت‌هاب الزامی است",
  },
  invalidGithubFormat: {
    en: "Invalid GitHub username format",
    fa: "فرمت نام کاربری گیت‌هاب نامعتبر است",
  },
  somethingWentWrong: {
    en: "Something went wrong. Please try again.",
    fa: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
  },
  networkError: {
    en: "Network error. Please try again.",
    fa: "خطای شبکه. لطفاً دوباره تلاش کنید.",
  },
};

export function useTranslation() {
  const { isRTL } = useDirection();
  const lang: Lang = isRTL ? "fa" : "en";

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  const getLang = (): Lang => lang;

  return { t, lang: getLang(), isRTL };
}
