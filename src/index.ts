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
  try {
    const { title, description, author, tags } = req.body; // Tags are strings here

    if (!tags || !Array.isArray(tags)) {
      res.status(400).json({ msg: "Tags should be an array of strings." });
      return;
    }

    // Step 1: Create or find tags
    const tagIds = await Promise.all(
      tags.map(async (tagName: string) => {
        const existingTag = await prisma.tag.findUnique({
          where: {
            tagName: tagName, // Now tagName is directly the string value
          },
        });

        if (existingTag) {
          return existingTag.id;
        }

        const newTag = await prisma.tag.create({
          data: {
            tagName: tagName,
          },
        });

        return newTag.id;
      })
    );

    // Step 2: Create the blog
    const blog = await prisma.blog.create({
      data: {
        title,
        description,
        author,
      },
    });

    // Step 3: Connect tags via BlogsTag
    await Promise.all(
      tagIds.map(async (tagId) => {
        await prisma.blogsTag.create({
          data: {
            blogId: blog.id,
            tagId: tagId,
          },
        });
      })
    );

    // Step 4: Return the blog with tags included
    const blogWithTags = await prisma.blog.findUnique({
      where: {
        id: blog.id,
      },
      include: {
        tags: {
          include: {
            tag: true, // Include tag details from BlogsTag relation
          },
        },
      },
    });

    res.status(201).json({
      msg: "Blog created successfully",
      blog: blogWithTags,
    });
  } catch (err) {
    console.error("Error while creating blog or adding tags: ", err);
    res.status(500).json({
      msg: "Error creating blog or adding tags",
      error: err,
    });
  }

});

app.listen(3000, () => {
  console.log(`Server running on port 3000 http://localhost:3000`);
});
