-- CreateEnum
CREATE TYPE "ProjectBadge" AS ENUM ('personal', 'blockchain', 'desktop');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "badges" "ProjectBadge"[] DEFAULT ARRAY[]::"ProjectBadge"[];
