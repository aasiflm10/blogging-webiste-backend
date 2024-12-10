import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

interface Tag{
  tagName : string
}
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hi there" });
});

app.post('/blog', async (req, res)=>{
  const {title, description, author} = req.body;
  const tags : Tag[] = req.body.tags;

  const blog = prisma.blog.create({
    data : {
      title : title,
      description : description,
      author : author,
      
    }
  })

})
app.listen(3000, () => {
  console.log(`Server running on port 3000 http://localhost:3000`);
});
