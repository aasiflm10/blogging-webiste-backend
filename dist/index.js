"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Hi there" });
});
app.post("/blog", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, author, tags } = req.body; // Tags are strings here
        if (!tags || !Array.isArray(tags)) {
            res.status(400).json({ msg: "Tags should be an array of strings." });
            return;
        }
        // Step 1: Create or find tags
        const tagIds = yield Promise.all(tags.map((tagName) => __awaiter(void 0, void 0, void 0, function* () {
            const existingTag = yield prisma.tag.findUnique({
                where: {
                    tagName: tagName, // Now tagName is directly the string value
                },
            });
            if (existingTag) {
                return existingTag.id;
            }
            const newTag = yield prisma.tag.create({
                data: {
                    tagName: tagName,
                },
            });
            return newTag.id;
        })));
        // Step 2: Create the blog
        const blog = yield prisma.blog.create({
            data: {
                title,
                description,
                author,
            },
        });
        // Step 3: Connect tags via BlogsTag
        yield Promise.all(tagIds.map((tagId) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.blogsTag.create({
                data: {
                    blogId: blog.id,
                    tagId: tagId,
                },
            });
        })));
        // Step 4: Return the blog with tags included
        const blogWithTags = yield prisma.blog.findUnique({
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
    }
    catch (err) {
        console.error("Error while creating blog or adding tags: ", err);
        res.status(500).json({
            msg: "Error creating blog or adding tags",
            error: err,
        });
    }
}));
app.get("/blogs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield prisma.blog.findMany({
            include: { tags: { include: { tag: true } } },
        });
        console.log("blogs : ", blogs);
        res.status(200).json({ blogs: blogs });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "error fetching blogs ", error: err });
    }
}));
app.post("/project", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, liveLink, githubLink, tags } = req.body;
        if (!tags || !Array.isArray(tags)) {
            res.status(400).json({ msg: "Tags should be an array of strings." });
            return;
        }
        const tagIds = yield Promise.all(tags.map((tagName) => __awaiter(void 0, void 0, void 0, function* () {
            const existingTag = yield prisma.tag.findUnique({
                where: {
                    tagName: tagName,
                },
            });
            if (existingTag) {
                return existingTag.id;
            }
            const newTag = yield prisma.tag.create({
                data: {
                    tagName: tagName,
                },
            });
            return newTag.id;
        })));
        const project = yield prisma.project.create({
            data: {
                name: name,
                description: description,
                liveLink: liveLink,
                githubLink: githubLink,
            },
        });
        //connect tagIds to project via ProjectTags table
        yield Promise.all(tagIds.map((tagId) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.projectsTag.create({
                data: {
                    projectId: project.id,
                    tagId: tagId,
                },
            });
        })));
        const projectWithTags = yield prisma.project.findFirst({
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}));
app.get("/projects", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield prisma.project.findMany({
            include: { tags: { include: { tag: true } } },
        });
        console.log("projects : ", projects);
        res.status(200).json({ blogs: projects });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "error fetching blogs ", error: err });
    }
}));
app.get("/allTags", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield prisma.tag.findMany();
    res.status(200).json({ tags });
}));
app.listen(3000, () => {
    console.log(`Server running on port 3000 http://localhost:3000`);
});
