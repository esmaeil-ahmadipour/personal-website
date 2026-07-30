-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "bioAr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "firstNameAr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "github" TEXT,
ADD COLUMN     "lastNameAr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "descriptionAr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nameAr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "parent_id" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "comments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "contentAr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "excerptAr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTrending" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "keywordsAr" TEXT,
ADD COLUMN     "keywordsEn" TEXT,
ADD COLUMN     "keywordsFa" TEXT,
ADD COLUMN     "language" TEXT DEFAULT 'en',
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ogImageAr" TEXT,
ADD COLUMN     "ogImageEn" TEXT,
ADD COLUMN     "ogImageFa" TEXT,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "seoDescriptionAr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "seoTitleAr" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "titleAr" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "color" TEXT DEFAULT '#3b82f6',
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "nameAr" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Author_email_idx" ON "Author"("email");

-- CreateIndex
CREATE INDEX "Category_parent_id_idx" ON "Category"("parent_id");

-- CreateIndex
CREATE INDEX "Category_isActive_idx" ON "Category"("isActive");

-- CreateIndex
CREATE INDEX "Category_order_idx" ON "Category"("order");

-- CreateIndex
CREATE INDEX "Post_isFeatured_idx" ON "Post"("isFeatured");

-- CreateIndex
CREATE INDEX "Post_isTrending_idx" ON "Post"("isTrending");

-- CreateIndex
CREATE INDEX "Post_language_idx" ON "Post"("language");

-- CreateIndex
CREATE INDEX "Post_priority_idx" ON "Post"("priority");

-- CreateIndex
CREATE INDEX "Post_views_idx" ON "Post"("views");

-- CreateIndex
CREATE INDEX "Tag_color_idx" ON "Tag"("color");
