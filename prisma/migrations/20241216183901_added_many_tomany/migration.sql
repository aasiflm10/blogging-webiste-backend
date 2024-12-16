/*
  Warnings:

  - You are about to drop the column `blogId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_blogId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_projectId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "blogId",
DROP COLUMN "projectId";

-- CreateTable
CREATE TABLE "BlogProjectTag" (
    "blogId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "BlogProjectTag_pkey" PRIMARY KEY ("blogId","tagId","projectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_id_key" ON "Tag"("id");

-- AddForeignKey
ALTER TABLE "BlogProjectTag" ADD CONSTRAINT "BlogProjectTag_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogProjectTag" ADD CONSTRAINT "BlogProjectTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogProjectTag" ADD CONSTRAINT "BlogProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
