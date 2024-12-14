import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
interface Tag {
  tagName: string;
}
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hi there" });
});

app.post("/blog", async (req, res) => {
  const { title, description, author } = req.body;
  const tags: Tag[] = req.body.tags;

  await Promise.all(
    tags.map(async (tag) => {
      await prisma.tag.create({
        data: {
          tagName: tag.tagName,
        },
      });
    })
  );
  const blog = await prisma.blog.create({
    data: {
      title: title,
      description: description,
      author: author,
      tags: {},
    },
  });
});
app.listen(3000, () => {
  console.log(`Server running on port 3000 http://localhost:3000`);
});
