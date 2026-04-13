-- AlterTable
ALTER TABLE "YouTubeVideo" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "YouTubeVideo" ADD COLUMN "lastChecked" TIMESTAMP(3);
