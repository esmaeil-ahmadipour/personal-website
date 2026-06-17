-- CreateTable
CREATE TABLE "RequestAccess" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "company" TEXT,
    "githubUsername" TEXT NOT NULL,
    "preferredStack" TEXT NOT NULL DEFAULT 'flutter',
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "RequestAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestAccess_email_idx" ON "RequestAccess"("email");

-- CreateIndex
CREATE INDEX "RequestAccess_status_idx" ON "RequestAccess"("status");

-- CreateIndex
CREATE INDEX "RequestAccess_createdAt_idx" ON "RequestAccess"("createdAt");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_status_idx" ON "Contact"("status");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");
