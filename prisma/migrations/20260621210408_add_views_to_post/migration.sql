/*
  Warnings:

  - You are about to drop the column `bio` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Author` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `seoDescription` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tag` table. All the data in the column will be lost.
  - Added the required column `firstNameEn` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstNameFa` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastNameEn` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastNameFa` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameFa` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentEn` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentFa` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleEn` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titleFa` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameFa` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tag_name_key";

-- AlterTable
ALTER TABLE "Author" DROP COLUMN "bio",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "bioEn" TEXT,
ADD COLUMN     "bioFa" TEXT,
ADD COLUMN     "firstNameEn" TEXT NOT NULL,
ADD COLUMN     "firstNameFa" TEXT NOT NULL,
ADD COLUMN     "lastNameEn" TEXT NOT NULL,
ADD COLUMN     "lastNameFa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "descriptionFa" TEXT,
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameFa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
DROP COLUMN "excerpt",
DROP COLUMN "seoDescription",
DROP COLUMN "seoTitle",
DROP COLUMN "title",
ADD COLUMN     "contentEn" TEXT NOT NULL,
ADD COLUMN     "contentFa" TEXT NOT NULL,
ADD COLUMN     "excerptEn" TEXT,
ADD COLUMN     "excerptFa" TEXT,
ADD COLUMN     "seoDescriptionEn" TEXT,
ADD COLUMN     "seoDescriptionFa" TEXT,
ADD COLUMN     "seoTitleEn" TEXT,
ADD COLUMN     "seoTitleFa" TEXT,
ADD COLUMN     "titleEn" TEXT NOT NULL,
ADD COLUMN     "titleFa" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "name",
ADD COLUMN     "nameEn" TEXT NOT NULL,
ADD COLUMN     "nameFa" TEXT NOT NULL;
