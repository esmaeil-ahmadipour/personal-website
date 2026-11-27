-- CreateEnum
CREATE TYPE "ProjectKind" AS ENUM ('research', 'tool');

-- CreateEnum
CREATE TYPE "ProjectStage" AS ENUM ('prototype', 'preProduction', 'live', 'openSource', 'archived');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionFa" TEXT NOT NULL DEFAULT '',
    "descriptionAr" TEXT NOT NULL DEFAULT '',
    "overviewEn" TEXT,
    "overviewFa" TEXT,
    "overviewAr" TEXT NOT NULL DEFAULT '',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "coverImageUrl" TEXT,
    "kind" "ProjectKind" NOT NULL,
    "stage" "ProjectStage" NOT NULL DEFAULT 'prototype',
    "year" INTEGER,
    "stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "url" TEXT,
    "sourceUrl" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectPost" (
    "projectId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectPost_pkey" PRIMARY KEY ("projectId","postId")
);

-- CreateTable
CREATE TABLE "NewsletterIssue" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "linkedinUrl" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "excerptEn" TEXT,
    "contentEn" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "excerptFa" TEXT,
    "contentFa" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL DEFAULT '',
    "excerptAr" TEXT NOT NULL DEFAULT '',
    "contentAr" TEXT NOT NULL DEFAULT '',
    "coverImageUrl" TEXT,
    "readingTimeMin" INTEGER,
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsletterIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterIssueTag" (
    "issueId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterIssueTag_pkey" PRIMARY KEY ("issueId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_status_order_idx" ON "Project"("status", "order");

-- CreateIndex
CREATE INDEX "Project_isFeatured_idx" ON "Project"("isFeatured");

-- CreateIndex
CREATE INDEX "Project_kind_idx" ON "Project"("kind");

-- CreateIndex
CREATE INDEX "Project_stage_idx" ON "Project"("stage");

-- CreateIndex
CREATE INDEX "ProjectPost_postId_idx" ON "ProjectPost"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterIssue_number_key" ON "NewsletterIssue"("number");

-- CreateIndex
CREATE INDEX "NewsletterIssue_status_publishedAt_idx" ON "NewsletterIssue"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "NewsletterIssue_authorId_idx" ON "NewsletterIssue"("authorId");

-- CreateIndex
CREATE INDEX "NewsletterIssue_categoryId_idx" ON "NewsletterIssue"("categoryId");

-- CreateIndex
CREATE INDEX "NewsletterIssueTag_tagId_idx" ON "NewsletterIssueTag"("tagId");

-- AddForeignKey
ALTER TABLE "ProjectPost" ADD CONSTRAINT "ProjectPost_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectPost" ADD CONSTRAINT "ProjectPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterIssue" ADD CONSTRAINT "NewsletterIssue_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterIssue" ADD CONSTRAINT "NewsletterIssue_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterIssueTag" ADD CONSTRAINT "NewsletterIssueTag_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "NewsletterIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsletterIssueTag" ADD CONSTRAINT "NewsletterIssueTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
