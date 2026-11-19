-- CreateEnum
CREATE TYPE "SeedStatus" AS ENUM ('running', 'succeeded', 'failed');

-- CreateTable
CREATE TABLE "SeedHistory" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" "SeedStatus" NOT NULL DEFAULT 'running',
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "error" TEXT,
    "gitSha" TEXT,
    "environment" TEXT,

    CONSTRAINT "SeedHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentSync" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'post',
    "slug" TEXT NOT NULL,
    "sourceHash" TEXT NOT NULL,
    "fieldHashes" JSONB NOT NULL DEFAULT '{}',
    "consumedForceTokens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "formatVersion" INTEGER NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeedHistory_version_key" ON "SeedHistory"("version");

-- CreateIndex
CREATE UNIQUE INDEX "ContentSync_kind_slug_key" ON "ContentSync"("kind", "slug");
