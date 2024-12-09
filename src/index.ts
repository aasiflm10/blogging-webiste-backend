import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hi there" });
});

app.listen(3000, () => {
  console.log(`Server running on port 3000 http://localhost:3000`);
});
