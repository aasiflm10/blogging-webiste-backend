/*
  Warnings:

  - You are about to drop the `BlogProjectTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlogProjectTag" DROP CONSTRAINT "BlogProjectTag_blogId_fkey";

-- DropForeignKey
ALTER TABLE "BlogProjectTag" DROP CONSTRAINT "BlogProjectTag_projectId_fkey";

-- DropForeignKey
ALTER TABLE "BlogProjectTag" DROP CONSTRAINT "BlogProjectTag_tagId_fkey";

-- DropTable
DROP TABLE "BlogProjectTag";

-- CreateTable
CREATE TABLE "BlogsTag" (
    "blogId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "BlogsTag_pkey" PRIMARY KEY ("blogId","tagId")
);

-- CreateTable
CREATE TABLE "ProjectsTag" (
    "tagId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectsTag_pkey" PRIMARY KEY ("projectId","tagId")
);

-- AddForeignKey
ALTER TABLE "BlogsTag" ADD CONSTRAINT "BlogsTag_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogsTag" ADD CONSTRAINT "BlogsTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsTag" ADD CONSTRAINT "ProjectsTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsTag" ADD CONSTRAINT "ProjectsTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
