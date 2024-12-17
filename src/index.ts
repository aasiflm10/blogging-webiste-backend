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

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: { tags: { include: { tag: true } } },
    });

    console.log("blogs : ", blogs);

    res.status(200).json({ blogs: blogs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "error fetching blogs ", error: err });
  }
});

app.post("/project", async (req, res) => {
  try {
    const { name, description, liveLink, githubLink, tags } = req.body;

    if (!tags || !Array.isArray(tags)) {
      res.status(400).json({ msg: "Tags should be an array of strings." });
      return;
    }

    const tagIds = await Promise.all(
      tags.map(async (tagName: string) => {
        const existingTag = await prisma.tag.findUnique({
          where: {
            tagName: tagName,
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

    const project = await prisma.project.create({
      data: {
        name: name,
        description: description,
        liveLink: liveLink,
        githubLink: githubLink,
      },
    });

    //connect tagIds to project via ProjectTags table
    await Promise.all(
      tagIds.map(async (tagId) => {
        await prisma.projectsTag.create({
          data: {
            projectId: project.id,
            tagId: tagId,
          },
        });
      })
    );

    const projectWithTags = await prisma.project.findFirst({
      where: {
        id: project.id,
      },
      include: {
        tags: {
          include: {
            tag: true, // Include tag details from BlogsTag relation
          },
        },
      },
    });

    res
      .status(200)
      .json({ msg: "Project added successfully ", project: projectWithTags });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.get("/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { tags: { include: { tag: true } } },
    });

    console.log("projects : ", projects);

    res.status(200).json({ projects: projects });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "error fetching blogs ", error: err });
  }
});
app.get("/allTags", async (req, res) => {
  const tags = await prisma.tag.findMany();
  res.status(200).json({ tags });
});

app.listen(3000, () => {
  console.log(`Server running on port 3000 http://localhost:3000`);
});
